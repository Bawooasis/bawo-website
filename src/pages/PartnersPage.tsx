import QRCode from "qrcode";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import DirectoryShell from "../directory/DirectoryShell";
import type { PartnerApplicantType } from "../directory/types";

type PartnerTab = {
  id: PartnerApplicantType;
  label: string;
  headline: string;
  benefits: string[];
  steps: string[];
  faq: Array<{ q: string; a: string }>;
  placeholderCode: string;
};

const TABS: PartnerTab[] = [
  {
    id: "promoter",
    label: "Promoters & DJs",
    headline: "Fill rooms with Nigerians & Afro NYC who already care about the culture.",
    benefits: [
      "Partner link + QR for flyers, stories, and door lists",
      "Event pages on joinbawo.com with ticket tracking",
      "Feature consideration in This weekend in NYC",
    ],
    steps: [
      "Apply with your nights and Instagram / TikTok",
      "Alexander reviews and issues your partner code",
      "Share your link — track clicks once tables are live",
    ],
    faq: [
      {
        q: "Do I need a ticketing platform?",
        a: "Eventbrite, Posh, Shotgun, or your own link all work. Affiliate fields are optional.",
      },
      {
        q: "When do I get approved?",
        a: "Applications are reviewed manually. You will hear back by email after review.",
      },
    ],
    placeholderCode: "BAWO-PROMO-DEMO",
  },
  {
    id: "venue",
    label: "Restaurants / salons / stores",
    headline: "Turn directory discovery into regulars who already cook, braid, and shop Naija.",
    benefits: [
      "Claimed listing with accurate hours and photos",
      "Partner link for Instagram bio and table tents",
      "Path into Places people save on /nyc",
    ],
    steps: [
      "Apply with your business details",
      "Claim or create your listing in the Business Portal",
      "Share your partner QR once approved",
    ],
    faq: [
      {
        q: "Is there a fee?",
        a: "Partner onboarding starts free. Growth plans unlock later when reporting is ready.",
      },
      {
        q: "Can I update my listing myself?",
        a: "Yes — after approval, manage details in the Business Portal at /businesses.",
      },
    ],
    placeholderCode: "BAWO-VENUE-DEMO",
  },
  {
    id: "student_society",
    label: "Student & alumni societies",
    headline: "Give your members one home for events, food spots, and circles across NYC.",
    benefits: [
      "Society partner link for welcome packets",
      "Co-hosted mixer / orientation event pages",
      "Warm intro into Community Circles",
    ],
    steps: [
      "Apply with your campus or alumni chapter",
      "Get a partner kit with QR + sample link",
      "Share with members — Join BawoSocial from your page",
    ],
    faq: [
      {
        q: "Which schools are welcome?",
        a: "Any NYC-area Nigerian / African student or alumni society. Start where your members already gather.",
      },
      {
        q: "Can multiple officers share the link?",
        a: "Yes. One approved partner code can be shared across your exec board.",
      },
    ],
    placeholderCode: "BAWO-CAMPUS-DEMO",
  },
];

export default function PartnersPage() {
  const [activeId, setActiveId] = useState<PartnerApplicantType>("promoter");
  const active = TABS.find((t) => t.id === activeId) || TABS[0];
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    city: "New York",
    website: "",
    message: "",
  });

  const sampleLink = useMemo(
    () => `https://www.joinbawo.com/nyc?ref=${encodeURIComponent(active.placeholderCode)}`,
    [active.placeholderCode],
  );

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(sampleLink, {
      width: 180,
      margin: 1,
      color: { dark: "#0E0A14", light: "#FFFFFF" },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [sampleLink]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    setError("");
    try {
      // Prefer Business Portal claim path shape; fallback to Mailchimp subscribe.
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: `${form.name} · ${active.label} · ${form.organization}`.slice(
            0,
            100,
          ),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Could not submit application");
      }
      setNotice(
        "Application received. Alexander reviews every partner manually — watch your email.",
      );
      setForm((current) => ({
        ...current,
        name: "",
        organization: "",
        website: "",
        message: "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DirectoryShell active="partners" joinOnPage>
      <section className="dir-hero">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#D6B26A]">
          Partner with BawoSocial
        </p>
        <h1>
          Grow with the <span className="dir-gold-text">NYC Nigerian &amp; Afro</span>{" "}
          community.
        </h1>
        <p>
          Promoters, venues, and student societies get a polished partner kit —
          reviewed by hand before anything goes live.
        </p>
      </section>

      <section className="dir-section" id="partners-apply">
        <div className="dir-partners-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`dir-tab${activeId === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="dir-partners-panel">
          <div className="space-y-6">
            <div className="dir-card p-6">
              <h2 className="text-2xl font-bold">{active.headline}</h2>
              <ul className="mt-4 space-y-2 text-sm text-[#F7F2EA]/75">
                {active.benefits.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="dir-card p-6">
              <h3 className="text-lg font-bold">Three steps</h3>
              <ol className="mt-3 space-y-3">
                {active.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-[#F7F2EA]/75">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D6B26A]/35 text-xs font-bold text-[#D6B26A]">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="dir-card p-6">
              <h3 className="text-lg font-bold">FAQ</h3>
              <div className="mt-3 space-y-4">
                {active.faq.map((item) => (
                  <div key={item.q}>
                    <p className="font-semibold text-[#F7E7C4]">{item.q}</p>
                    <p className="mt-1 text-sm text-[#F7F2EA]/65">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dir-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D6B26A]">
                Kit preview
              </p>
              <p className="mt-2 break-all text-sm text-[#F7E7C4]/85">{sampleLink}</p>
              <div className="mt-4 dir-qr">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Sample partner QR code" width={180} height={180} />
                ) : (
                  <div className="dir-skel h-[180px] w-[180px]" />
                )}
              </div>
              <p className="mt-3 text-xs text-[#F7F2EA]/55">
                Placeholder code {active.placeholderCode} — replaced after approval.
              </p>
            </div>

            <form className="dir-card space-y-3 p-6" onSubmit={onSubmit}>
              <h3 className="text-lg font-bold">Apply</h3>
              <label className="block text-sm">
                Your name
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-[#D6B26A]/25 bg-[#160F24] px-3 py-2.5"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Email
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-xl border border-[#D6B26A]/25 bg-[#160F24] px-3 py-2.5"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Organization / brand
                <input
                  required
                  className="mt-1 w-full rounded-xl border border-[#D6B26A]/25 bg-[#160F24] px-3 py-2.5"
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                />
              </label>
              <label className="block text-sm">
                City
                <input
                  className="mt-1 w-full rounded-xl border border-[#D6B26A]/25 bg-[#160F24] px-3 py-2.5"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Website or social
                <input
                  className="mt-1 w-full rounded-xl border border-[#D6B26A]/25 bg-[#160F24] px-3 py-2.5"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Tell us about your nights / venue / society
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-[#D6B26A]/25 bg-[#160F24] px-3 py-2.5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
              {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <button
                type="submit"
                className="dir-btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Submit partner application"}
              </button>
              <p className="text-xs text-[#F7F2EA]/5">
                Submissions route for manual review. You can also claim a listing
                anytime in the{" "}
                <a href="/businesses" className="text-[#D6B26A]">
                  Business Portal
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </section>
    </DirectoryShell>
  );
}
