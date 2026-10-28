import {
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  MapPinned,
  MousePointerClick,
  Plus,
  Route,
  Sparkles,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FOUNDING_STOREFRONTS,
  type FoundingStorefront,
} from "./foundingStorefronts";
import type { PlatformApi } from "./platformApi";
import type { PortalTab } from "./PortalLayout";
import { EmptyState, MetricCard } from "./PortalUi";
import type {
  StorefrontCatalog,
  StorefrontItem,
  StorefrontItemInput,
  StorefrontPayoutSettings,
  VendorClaimInput,
  VendorOverview,
} from "./types";

type BusinessPortalProps = {
  data: VendorOverview;
  activeTab: PortalTab;
  busy: boolean;
  api: PlatformApi;
  onSubmit: (input: VendorClaimInput) => Promise<void>;
  onNotice?: (message: string) => void;
  onError?: (message: string) => void;
};

const initialClaim: VendorClaimInput = {
  businessName: "",
  category: "",
  city: "New York",
  email: "",
  phone: "",
  website: "",
  message: "",
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

type StoreOption = {
  id: string;
  name: string;
  subtitle: string;
  kind: "owned" | "founding";
  founding?: FoundingStorefront;
};

const emptyItemForm = (): StorefrontItemInput => ({
  categoryName: "Entrees",
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  isPopular: false,
  isAvailable: true,
});

export default function BusinessPortal({
  data,
  activeTab,
  busy,
  api,
  onSubmit,
  onNotice,
  onError,
}: BusinessPortalProps) {
  const [claim, setClaim] = useState<VendorClaimInput>({
    ...initialClaim,
    email: data.account.email || "",
  });

  const storeOptions = useMemo<StoreOption[]>(() => {
    const owned = data.listings.map((listing) => ({
      id: listing.id,
      name: listing.name,
      subtitle: `${listing.category || "Business"} · ${listing.neighborhood || listing.borough || "NYC"}`,
      kind: "owned" as const,
    }));
    const founding = FOUNDING_STOREFRONTS.map((store) => ({
      id: store.id,
      name: store.name,
      subtitle: `${store.handle} · ${store.address}`,
      kind: "founding" as const,
      founding: store,
    }));
    return [...owned, ...founding];
  }, [data.listings]);

  const [selectedStoreId, setSelectedStoreId] = useState(
    () => storeOptions[0]?.id || FOUNDING_STOREFRONTS[0].id,
  );
  const [catalog, setCatalog] = useState<StorefrontCatalog | null>(null);
  const [catalogBusy, setCatalogBusy] = useState(false);
  const [itemForm, setItemForm] = useState<StorefrontItemInput>(emptyItemForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [orderAmount, setOrderAmount] = useState(110);
  const [payoutDraft, setPayoutDraft] = useState<StorefrontPayoutSettings | null>(
    null,
  );

  const selectedStore =
    storeOptions.find((option) => option.id === selectedStoreId) ||
    storeOptions[0];

  useEffect(() => {
    if (!selectedStoreId) return;
    let cancelled = false;
    const load = async () => {
      setCatalogBusy(true);
      try {
        const next = await api.fetchStorefrontCatalog(selectedStoreId);
        if (cancelled) return;
        setCatalog(next);
        setPayoutDraft(next.payouts);
      } catch (error) {
        if (!cancelled) {
          onError?.(
            error instanceof Error
              ? error.message
              : "Unable to load storefront catalog.",
          );
        }
      } finally {
        if (!cancelled) setCatalogBusy(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [api, selectedStoreId, onError]);

  const groupedItems = useMemo(() => {
    const items = catalog?.items || [];
    const groups = new Map<string, StorefrontItem[]>();
    for (const item of items) {
      const key = item.category_name || "General";
      const list = groups.get(key) || [];
      list.push(item);
      groups.set(key, list);
    }
    return Array.from(groups.entries());
  }, [catalog]);

  const saveItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedStoreId || !itemForm.name.trim()) return;
    setCatalogBusy(true);
    try {
      await api.upsertStorefrontItem(selectedStoreId, {
        ...itemForm,
        id: editingId || undefined,
        price: Number(itemForm.price) || 0,
      });
      const next = await api.fetchStorefrontCatalog(selectedStoreId);
      setCatalog(next);
      setItemForm(emptyItemForm());
      setEditingId(null);
      onNotice?.(
        editingId
          ? "Product updated for your BawoSocial storefront."
          : "Product added to your BawoSocial storefront.",
      );
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Unable to save product.",
      );
    } finally {
      setCatalogBusy(false);
    }
  };

  const patchItem = async (
    item: StorefrontItem,
    patch: Partial<StorefrontItemInput>,
  ) => {
    if (!selectedStoreId) return;
    setCatalogBusy(true);
    try {
      await api.upsertStorefrontItem(selectedStoreId, {
        id: item.id,
        categoryName: patch.categoryName || item.category_name,
        name: patch.name || item.name,
        description:
          patch.description !== undefined
            ? patch.description
            : item.description,
        price: patch.price !== undefined ? patch.price : item.price,
        imageUrl:
          patch.imageUrl !== undefined ? patch.imageUrl : item.image_url,
        isPopular:
          patch.isPopular !== undefined ? patch.isPopular : item.is_popular,
        isAvailable:
          patch.isAvailable !== undefined
            ? patch.isAvailable
            : item.is_available,
        sortOrder: item.sort_order,
      });
      setCatalog(await api.fetchStorefrontCatalog(selectedStoreId));
      onNotice?.("Storefront item updated.");
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Unable to update item.",
      );
    } finally {
      setCatalogBusy(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!selectedStoreId) return;
    if (!window.confirm("Delete this product from your storefront?")) return;
    setCatalogBusy(true);
    try {
      await api.deleteStorefrontItem(selectedStoreId, itemId);
      setCatalog(await api.fetchStorefrontCatalog(selectedStoreId));
      onNotice?.("Product removed from storefront.");
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : "Unable to delete item.",
      );
    } finally {
      setCatalogBusy(false);
    }
  };

  const savePayouts = async (override?: StorefrontPayoutSettings) => {
    if (!selectedStoreId) return;
    const payload = override || payoutDraft;
    if (!payload) return;
    setCatalogBusy(true);
    try {
      const saved = await api.savePayoutSettings(selectedStoreId, payload);
      setPayoutDraft(saved);
      setCatalog((current) =>
        current ? { ...current, payouts: saved } : current,
      );
      onNotice?.(
        saved.payouts_requested
          ? "Fulfillment settings saved. Direct payout activation requested."
          : "Fulfillment and split settings saved.",
      );
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Unable to save payout settings.",
      );
    } finally {
      setCatalogBusy(false);
    }
  };

  if (activeTab === "dashboard") {
    return (
      <>
        <section className="portal-metrics" aria-label="Business metrics">
          <MetricCard
            icon={MapPinned}
            label="Live listings"
            value={data.metrics.listings}
            detail="Approved directory presence"
            tone="success"
          />
          <MetricCard
            icon={Clock3}
            label="Pending claims"
            value={data.metrics.pendingClaims}
            detail="Waiting for BawoSocial review"
            tone={data.metrics.pendingClaims > 0 ? "warning" : "neutral"}
          />
          <MetricCard
            icon={MousePointerClick}
            label="Tracked actions"
            value={data.metrics.trackedClicks ?? "n/a"}
            detail={
              data.metrics.trackedClicks === null
                ? "Measurement is being connected"
                : "All time"
            }
            tone="accent"
          />
          <MetricCard
            icon={BadgeCheck}
            label="Current plan"
            value={data.metrics.plan || "Free"}
            detail={
              data.metrics.plan === null
                ? "Billing is not active yet"
                : "Current subscription"
            }
          />
        </section>
        <section className="portal-panel portal-callout portal-business-hero">
          <div>
            <span className="portal-kicker">NYC launch workspace</span>
            <h2>Build a trusted presence before paid growth begins.</h2>
            <p>
              Claim your business, keep its directory identity accurate, manage
              products &amp; prices, and prepare payouts without exposing member
              information.
            </p>
            <div className="portal-feature-row">
              <span>
                <BadgeCheck aria-hidden />
                Admin-reviewed claims
              </span>
              <span>
                <Route aria-hidden />
                Products &amp; prices live
              </span>
              <span>
                <Sparkles aria-hidden />
                90/10 split ready
              </span>
            </div>
          </div>
          <Building2 aria-hidden />
        </section>
      </>
    );
  }

  if (activeTab === "products") {
    const previewItems = (catalog?.items || [])
      .filter((item) => item.is_available)
      .slice(0, 6);
    return (
      <div className="portal-stack storefront-ops">
        <section className="portal-panel storefront-selector">
          <div className="portal-panel-heading">
            <div>
              <span className="portal-kicker">NYC Nigerian storefronts</span>
              <h2>Products &amp; Prices</h2>
              <p className="storefront-lead">
                Edit your owned listing or preview one of our 6 Founding NYC
                Nigerian Partner storefronts. Changes save immediately (Supabase
                when claimed, local preview otherwise).
              </p>
            </div>
          </div>
          <label className="storefront-select-label">
            Active storefront
            <select
              value={selectedStoreId}
              onChange={(event) => {
                setSelectedStoreId(event.target.value);
                setEditingId(null);
                setItemForm(emptyItemForm());
              }}
            >
              {storeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.kind === "founding" ? "Founding · " : "Owned · "}
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          {selectedStore ? (
            <div className="storefront-meta">
              <strong>{selectedStore.name}</strong>
              <span>{selectedStore.subtitle}</span>
            </div>
          ) : null}
        </section>

        <div className="storefront-grid">
          <section className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <span className="portal-kicker">Catalog editor</span>
                <h2>
                  {editingId ? "Edit product" : "Add new product / dish / service"}
                </h2>
              </div>
            </div>
            <form className="portal-form storefront-form" onSubmit={saveItem}>
              <div className="portal-form-grid">
                <label>
                  Item name
                  <input
                    required
                    minLength={2}
                    value={itemForm.name}
                    onChange={(event) =>
                      setItemForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Classic Suya Dinner"
                  />
                </label>
                <label>
                  Category
                  <input
                    required
                    value={itemForm.categoryName}
                    onChange={(event) =>
                      setItemForm((current) => ({
                        ...current,
                        categoryName: event.target.value,
                      }))
                    }
                    placeholder="Entrees, Starters, Pantry…"
                  />
                </label>
              </div>
              <div className="portal-form-grid">
                <label>
                  Price ($)
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(event) =>
                      setItemForm((current) => ({
                        ...current,
                        price: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Image URL (optional)
                  <input
                    type="url"
                    value={itemForm.imageUrl || ""}
                    onChange={(event) =>
                      setItemForm((current) => ({
                        ...current,
                        imageUrl: event.target.value,
                      }))
                    }
                    placeholder="https://"
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  rows={3}
                  value={itemForm.description || ""}
                  onChange={(event) =>
                    setItemForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Short menu description for the BawoSocial app"
                />
              </label>
              <div className="storefront-toggles">
                <label className="storefront-check">
                  <input
                    type="checkbox"
                    checked={Boolean(itemForm.isPopular)}
                    onChange={(event) =>
                      setItemForm((current) => ({
                        ...current,
                        isPopular: event.target.checked,
                      }))
                    }
                  />
                  Popular / Featured
                </label>
                <label className="storefront-check">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable !== false}
                    onChange={(event) =>
                      setItemForm((current) => ({
                        ...current,
                        isAvailable: event.target.checked,
                      }))
                    }
                  />
                  In Stock / Available
                </label>
              </div>
              <div className="portal-row-actions">
                {editingId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setItemForm(emptyItemForm());
                    }}
                  >
                    Cancel edit
                  </button>
                ) : null}
                <button
                  className="portal-primary-button"
                  type="submit"
                  disabled={catalogBusy || busy}
                >
                  <Plus size={16} aria-hidden />
                  {catalogBusy
                    ? "Saving…"
                    : editingId
                      ? "Save changes"
                      : "Add to storefront"}
                </button>
              </div>
            </form>

            <div className="portal-panel-heading portal-panel-heading-spaced">
              <div>
                <span className="portal-kicker">Live menu</span>
                <h2>Inline price &amp; availability</h2>
              </div>
            </div>
            <div className="portal-list storefront-item-list">
              {!groupedItems.length ? (
                <EmptyState
                  icon={Sparkles}
                  title="No products yet"
                  body="Add your first dish, grocery item, catering tray, or braiding service above."
                />
              ) : (
                groupedItems.map(([category, items]) => (
                  <div key={category} className="storefront-category-block">
                    <h3>{category}</h3>
                    {items.map((item) => (
                      <article className="portal-list-row storefront-item-row" key={item.id}>
                        <div className="portal-list-main">
                          <strong>
                            {item.name}
                            {item.is_popular ? (
                              <span className="storefront-popular-chip">
                                <Star size={12} aria-hidden /> Popular
                              </span>
                            ) : null}
                          </strong>
                          <span>
                            {item.description || "No description"} ·{" "}
                            {item.is_available ? "Available" : "Sold out"}
                          </span>
                        </div>
                        <label className="storefront-price-edit">
                          $
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={item.price}
                            key={`${item.id}-${item.price}`}
                            onBlur={(event) => {
                              const nextPrice = Number(event.target.value);
                              if (
                                Number.isFinite(nextPrice) &&
                                nextPrice !== item.price
                              ) {
                                void patchItem(item, { price: nextPrice });
                              }
                            }}
                          />
                        </label>
                        <div className="portal-row-actions">
                          <button
                            type="button"
                            disabled={catalogBusy}
                            onClick={() =>
                              void patchItem(item, {
                                isAvailable: !item.is_available,
                              })
                            }
                          >
                            {item.is_available ? "Sold out" : "Available"}
                          </button>
                          <button
                            type="button"
                            disabled={catalogBusy}
                            onClick={() =>
                              void patchItem(item, {
                                isPopular: !item.is_popular,
                              })
                            }
                          >
                            {item.is_popular ? "Unfeature" : "Popular"}
                          </button>
                          <button
                            type="button"
                            disabled={catalogBusy}
                            onClick={() => {
                              setEditingId(item.id);
                              setItemForm({
                                id: item.id,
                                categoryName: item.category_name,
                                name: item.name,
                                description: item.description || "",
                                price: item.price,
                                imageUrl: item.image_url || "",
                                isPopular: item.is_popular,
                                isAvailable: item.is_available,
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="is-danger"
                            disabled={catalogBusy}
                            onClick={() => void removeItem(item.id)}
                          >
                            <Trash2 size={14} aria-hidden />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="portal-panel storefront-preview" aria-label="App storefront preview">
            <div className="portal-panel-heading">
              <div>
                <span className="portal-kicker">Live BawoSocial app preview</span>
                <h2>How customers will see it</h2>
              </div>
            </div>
            <div className="storefront-phone">
              <div className="storefront-phone-notch" aria-hidden />
              <div className="storefront-phone-header">
                <strong>{selectedStore?.name || "Your store"}</strong>
                <span>{selectedStore?.subtitle || "NYC"}</span>
              </div>
              <div className="storefront-phone-list">
                {previewItems.length === 0 ? (
                  <p>Add available products to preview your storefront.</p>
                ) : (
                  previewItems.map((item) => (
                    <div key={item.id} className="storefront-phone-item">
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.category_name}</span>
                      </div>
                      <em>{money(item.price)}</em>
                    </div>
                  ))
                )}
              </div>
              <button type="button" className="storefront-phone-cta">
                Order / Request on BawoSocial
              </button>
            </div>
            <p className="storefront-preview-note">
              Source: {catalog?.source === "supabase" ? "Supabase menu tables" : "Local preview catalog"}
              {catalogBusy ? " · syncing…" : ""}
            </p>
          </section>
        </div>
      </div>
    );
  }

  if (activeTab === "payouts") {
    const settings = payoutDraft || catalog?.payouts;
    const feePct = settings?.platform_fee_pct ?? 10;
    const businessPct = Math.max(0, 100 - feePct);
    const subtotal = Math.max(0, Number(orderAmount) || 0);
    const delivery =
      settings?.accepts_delivery ? Number(settings.delivery_fee) || 0 : 0;
    const platformShare = (subtotal * feePct) / 100;
    const businessPayout = subtotal - platformShare;

    return (
      <div className="portal-stack payout-ops">
        <section className="portal-panel">
          <div className="portal-panel-heading">
            <div>
              <span className="portal-kicker">Transparent partner economics</span>
              <h2>Payouts &amp; Revenue Split</h2>
              <p className="storefront-lead">
                Default model: <strong>{businessPct}%</strong> direct to your
                business / <strong>{feePct}%</strong> BawoSocial platform partner
                share — charged only when an order is placed.
              </p>
            </div>
          </div>
          <label className="storefront-select-label">
            Storefront for payout settings
            <select
              value={selectedStoreId}
              onChange={(event) => setSelectedStoreId(event.target.value)}
            >
              {storeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        <div className="storefront-grid">
          <section className="portal-panel">
            <div className="portal-panel-heading">
              <div>
                <span className="portal-kicker">Interactive calculator</span>
                <h2>See the exact dollar split</h2>
              </div>
            </div>
            <label>
              Sample order amount ($)
              <input
                type="range"
                min="10"
                max="250"
                step="1"
                value={orderAmount}
                onChange={(event) => setOrderAmount(Number(event.target.value))}
              />
            </label>
            <div className="payout-amount-row">
              <button type="button" onClick={() => setOrderAmount(25)}>
                $25
              </button>
              <button type="button" onClick={() => setOrderAmount(50)}>
                $50
              </button>
              <button type="button" onClick={() => setOrderAmount(110)}>
                $110
              </button>
              <label>
                Custom
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderAmount}
                  onChange={(event) =>
                    setOrderAmount(Number(event.target.value))
                  }
                />
              </label>
            </div>
            <div className="payout-breakdown">
              <div>
                <span>Customer order subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div className="is-business">
                <span>Business payout ({businessPct}%)</span>
                <strong>{money(businessPayout)}</strong>
              </div>
              <div className="is-platform">
                <span>BawoSocial platform share ({feePct}%)</span>
                <strong>{money(platformShare)}</strong>
              </div>
              {delivery > 0 ? (
                <div>
                  <span>Delivery fee (passthrough)</span>
                  <strong>{money(delivery)}</strong>
                </div>
              ) : null}
            </div>
          </section>

          <section className="portal-panel payout-activate">
            <div className="portal-panel-heading">
              <div>
                <span className="portal-kicker">Stripe Connect</span>
                <h2>Activate Direct Payouts</h2>
              </div>
              <Wallet aria-hidden />
            </div>
            {settings ? (
              <div className="portal-form">
                <div className="storefront-toggles">
                  <label className="storefront-check">
                    <input
                      type="checkbox"
                      checked={settings.accepts_pickup}
                      onChange={(event) =>
                        setPayoutDraft((current) =>
                          current
                            ? {
                                ...current,
                                accepts_pickup: event.target.checked,
                              }
                            : current,
                        )
                      }
                    />
                    Pickup
                  </label>
                  <label className="storefront-check">
                    <input
                      type="checkbox"
                      checked={settings.accepts_delivery}
                      onChange={(event) =>
                        setPayoutDraft((current) =>
                          current
                            ? {
                                ...current,
                                accepts_delivery: event.target.checked,
                              }
                            : current,
                        )
                      }
                    />
                    Delivery
                  </label>
                  <label className="storefront-check">
                    <input
                      type="checkbox"
                      checked={settings.accepts_instore_booking}
                      onChange={(event) =>
                        setPayoutDraft((current) =>
                          current
                            ? {
                                ...current,
                                accepts_instore_booking: event.target.checked,
                              }
                            : current,
                        )
                      }
                    />
                    In-Store / Booking
                  </label>
                </div>
                <div className="portal-form-grid">
                  <label>
                    Delivery fee ($)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.delivery_fee}
                      onChange={(event) =>
                        setPayoutDraft((current) =>
                          current
                            ? {
                                ...current,
                                delivery_fee: Number(event.target.value) || 0,
                              }
                            : current,
                        )
                      }
                    />
                  </label>
                  <label>
                    Minimum order ($)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.min_order_amount}
                      onChange={(event) =>
                        setPayoutDraft((current) =>
                          current
                            ? {
                                ...current,
                                min_order_amount:
                                  Number(event.target.value) || 0,
                              }
                            : current,
                        )
                      }
                    />
                  </label>
                </div>
                <label>
                  Platform fee % (default 10)
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={settings.platform_fee_pct}
                    onChange={(event) =>
                      setPayoutDraft((current) =>
                        current
                          ? {
                              ...current,
                              platform_fee_pct:
                                Number(event.target.value) || 10,
                            }
                          : current,
                      )
                    }
                  />
                </label>
                <div className="payout-status-card">
                  <CheckCircle2 aria-hidden />
                  <div>
                    <strong>
                      Status:{" "}
                      {settings.stripe_connect_status === "active"
                        ? "Payouts active"
                        : settings.payouts_requested
                          ? "Activation requested"
                          : "Not started"}
                    </strong>
                    <p>
                      Save fulfillment settings, then request Stripe Connect
                      split payouts once your storefront is approved.
                    </p>
                  </div>
                </div>
                <div className="portal-row-actions">
                  <button
                    type="button"
                    className="portal-primary-button"
                    disabled={catalogBusy || busy}
                    onClick={() => void savePayouts()}
                  >
                    Save fulfillment settings
                  </button>
                  <button
                    type="button"
                    disabled={catalogBusy || busy || !settings}
                    onClick={() => {
                      if (!settings) return;
                      const next = {
                        ...settings,
                        payouts_requested: true,
                        stripe_connect_status:
                          settings.stripe_connect_status === "active"
                            ? ("active" as const)
                            : ("pending" as const),
                      };
                      setPayoutDraft(next);
                      void savePayouts(next);
                    }}
                  >
                    Activate Direct Payouts (Stripe Connect)
                  </button>
                </div>
              </div>
            ) : (
              <p>Loading payout settings…</p>
            )}
          </section>
        </div>
      </div>
    );
  }

  if (activeTab === "growth") {
    return (
      <div className="portal-stack">
        <section className="portal-panel">
          <div className="portal-panel-heading">
            <div>
              <span className="portal-kicker">Business growth path</span>
              <h2>What unlocks next</h2>
            </div>
            <BarChart3 aria-hidden />
          </div>
          <div className="portal-roadmap-grid">
            <article className="is-ready">
              <span>01</span>
              <strong>Verified presence</strong>
              <p>Claim approval and owned listings are already connected.</p>
            </article>
            <article className="is-ready">
              <span>02</span>
              <strong>Products &amp; payouts</strong>
              <p>
                Menu prices and the 90/10 split calculator are live in this
                portal.
              </p>
            </article>
            <article className="is-next">
              <span>03</span>
              <strong>Customer outcomes</strong>
              <p>
                Views, calls, directions, and website clicks are the next system.
              </p>
            </article>
          </div>
        </section>
        <section className="portal-panel portal-callout">
          <div>
            <span className="portal-kicker">Measurement promise</span>
            <h2>No invented performance numbers.</h2>
            <p>
              The dashboard will stay honest and unavailable until secure
              aggregate reporting is deployed for each verified listing.
            </p>
          </div>
          <MousePointerClick aria-hidden />
        </section>
      </div>
    );
  }

  const submitClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(claim);
    setClaim({ ...initialClaim, email: data.account.email || "" });
  };

  return (
    <div className="portal-stack portal-two-column">
      <section className="portal-panel">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">Owned directory presence</span>
            <h2>Your listings</h2>
          </div>
        </div>
        <div className="portal-list">
          {data.listings.length === 0 && (
            <EmptyState
              icon={MapPinned}
              title="No approved listings yet"
              body="Submit your business for review to start building an owned directory presence."
            />
          )}
          {data.listings.map((listing) => (
            <article className="portal-list-row portal-listing-row" key={listing.id}>
              <div className="portal-listing-summary">
                <div className="portal-listing-thumb">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt="" />
                  ) : (
                    <span>{listing.name.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div className="portal-list-main">
                  <strong>{listing.name}</strong>
                  <span>
                    {listing.category || "Restaurant"} ·{" "}
                    {listing.neighborhood || listing.borough || "NYC"}
                  </span>
                </div>
              </div>
              <span
                className={`portal-status ${listing.is_active === false ? "is-muted" : "is-success"}`}
              >
                {listing.is_active === false ? "Inactive" : "Live"}
              </span>
            </article>
          ))}
        </div>
        <div className="portal-panel-heading portal-panel-heading-spaced">
          <div>
            <span className="portal-kicker">Review history</span>
            <h2>Claims</h2>
          </div>
        </div>
        <div className="portal-list">
          {data.claims.length === 0 && (
            <EmptyState
              icon={Clock3}
              title="No claims submitted"
              body="New submissions and their review status will appear here."
            />
          )}
          {data.claims.map((item) => (
            <article className="portal-list-row" key={item.id}>
              <div className="portal-list-main">
                <strong>{item.name}</strong>
                <span>
                  {item.category || "Explore"} · {item.city || "NYC"}
                </span>
              </div>
              <span
                className={`portal-status ${item.status === "approved" ? "is-success" : item.status === "rejected" ? "is-danger" : "is-warning"}`}
              >
                {item.status}
              </span>
            </article>
          ))}
        </div>
      </section>
      <section className="portal-panel">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">Admin reviewed</span>
            <h2>Claim a business</h2>
          </div>
        </div>
        <form className="portal-form" onSubmit={submitClaim}>
          <label>
            Business name
            <input
              required
              minLength={2}
              value={claim.businessName}
              onChange={(event) =>
                setClaim({ ...claim, businessName: event.target.value })
              }
            />
          </label>
          <div className="portal-form-grid">
            <label>
              Category
              <input
                required
                value={claim.category}
                onChange={(event) =>
                  setClaim({ ...claim, category: event.target.value })
                }
                placeholder="Restaurant, legal, shipping…"
              />
            </label>
            <label>
              City
              <input
                required
                value={claim.city}
                onChange={(event) =>
                  setClaim({ ...claim, city: event.target.value })
                }
              />
            </label>
          </div>
          <label>
            Email
            <input
              required
              type="email"
              value={claim.email}
              onChange={(event) =>
                setClaim({ ...claim, email: event.target.value })
              }
            />
          </label>
          <div className="portal-form-grid">
            <label>
              Phone
              <input
                type="tel"
                value={claim.phone}
                onChange={(event) =>
                  setClaim({ ...claim, phone: event.target.value })
                }
              />
            </label>
            <label>
              Website
              <input
                type="url"
                value={claim.website}
                onChange={(event) =>
                  setClaim({ ...claim, website: event.target.value })
                }
                placeholder="https://"
              />
            </label>
          </div>
          <label>
            Notes
            <textarea
              rows={4}
              value={claim.message}
              onChange={(event) =>
                setClaim({ ...claim, message: event.target.value })
              }
              placeholder="Tell the review team what this business provides."
            />
          </label>
          <button
            className="portal-primary-button"
            type="submit"
            disabled={busy}
          >
            {busy ? "Submitting…" : "Submit for review"}
          </button>
          <p className="portal-form-note">
            Submitting does not publish automatically. A BawoSocial administrator
            must approve the claim.
          </p>
        </form>
      </section>
    </div>
  );
}
