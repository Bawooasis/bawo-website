import { Archive, AtSign, CalendarClock, Handshake, Mail, MessageSquare, Pencil, Plus, Search, Target, UsersRound } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { EmptyState, MetricCard } from "./PortalUi";
import type { AdminAction, CrmActivity, CrmLead, CrmStage } from "./types";

type CrmPanelProps = {
  leads: CrmLead[];
  activities: CrmActivity[];
  busy: boolean;
  onAction: (action: AdminAction, successMessage: string) => Promise<boolean>;
};

type LeadDraft = {
  name: string;
  category: CrmLead["category"];
  stage: CrmStage;
  priority: CrmLead["priority"];
  score: string;
  email: string;
  city: string;
  borough: string;
  websiteUrl: string;
  instagramHandle: string;
  followerCount: string;
  contactName: string;
  ownerName: string;
  offer: string;
  nextAction: string;
  nextActionAt: string;
  notes: string;
};

const stages: CrmStage[] = ["researched", "ready", "drafted", "contacted", "replied", "meeting", "proposal", "partnered", "not_fit", "paused"];
const emptyDraft = (): LeadDraft => ({
  name: "", category: "entertainment", stage: "researched", priority: "medium", score: "",
  email: "", city: "New York", borough: "", websiteUrl: "", instagramHandle: "", followerCount: "",
  contactName: "", ownerName: "Alexander", offer: "Founding NYC partner", nextAction: "Find decision-maker email",
  nextActionAt: "", notes: "",
});
const localDate = (value: string | null) => value ? new Date(value).toISOString().slice(0, 16) : "";
const draftFromLead = (lead: CrmLead): LeadDraft => ({
  name: lead.name, category: lead.category, stage: lead.stage, priority: lead.priority,
  score: lead.score === null ? "" : String(lead.score), email: lead.email || "", city: lead.city || "",
  borough: lead.borough || "", websiteUrl: lead.website_url || "", instagramHandle: lead.instagram_handle || "",
  followerCount: lead.follower_count === null ? "" : String(lead.follower_count), contactName: lead.contact_name || "",
  ownerName: lead.owner_name || "", offer: lead.offer || "", nextAction: lead.next_action || "",
  nextActionAt: localDate(lead.next_action_at), notes: lead.notes || "",
});
const pretty = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function CrmPanel({ leads, activities, busy, onAction }: CrmPanelProps) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<"all" | CrmStage>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<LeadDraft>(emptyDraft);
  const [activityLeadId, setActivityLeadId] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
      const matchesQuery = !normalized || [lead.name, lead.email, lead.instagram_handle, lead.city, lead.category]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(normalized));
      return matchesStage && matchesQuery;
    });
  }, [leads, query, stageFilter]);
  const ready = leads.filter((lead) => lead.stage === "ready" && lead.email).length;
  const contacted = leads.filter((lead) => ["contacted", "replied", "meeting", "proposal", "partnered"].includes(lead.stage)).length;
  const replies = leads.filter((lead) => ["replied", "meeting", "proposal", "partnered"].includes(lead.stage)).length;
  const partners = leads.filter((lead) => lead.stage === "partnered").length;

  const openNew = () => { setEditingId("new"); setDraft(emptyDraft()); };
  const openEdit = (lead: CrmLead) => { setEditingId(lead.id); setDraft(draftFromLead(lead)); };
  const update = <K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const saveLead = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await onAction({
      action: "save_crm_lead",
      targetId: editingId || "new",
      crmLead: {
        name: draft.name, category: draft.category, stage: draft.stage, priority: draft.priority,
        score: draft.score ? Number(draft.score) : null, email: draft.email || null, phone: null,
        city: draft.city || null, borough: draft.borough || null, websiteUrl: draft.websiteUrl || null,
        instagramHandle: draft.instagramHandle || null, followerCount: draft.followerCount ? Number(draft.followerCount) : null,
        contactName: draft.contactName || null, contactRole: null, ownerName: draft.ownerName || null,
        source: editingId === "new" ? "control_center" : "manual", sourceDetail: null,
        offer: draft.offer || null, nextAction: draft.nextAction || null, nextActionAt: draft.nextActionAt || null,
        notes: draft.notes || null,
      },
    }, editingId === "new" ? "Lead added to the revenue pipeline." : "Lead updated.");
    if (saved) setEditingId(null);
  };
  const logNote = async (leadId: string) => {
    if (!activityNote.trim()) return;
    const saved = await onAction({
      action: "log_crm_activity", targetId: leadId,
      crmActivity: { activityType: "note", channel: "system", subject: "Operator note", details: activityNote, occurredAt: new Date().toISOString() },
    }, "CRM activity recorded.");
    if (saved) { setActivityNote(""); setActivityLeadId(null); }
  };

  return <div className="portal-stack crm-ops">
    <section className="crm-hero">
      <div><span className="portal-kicker">Revenue operations</span><h2>Move qualified NYC partners toward cash</h2><p>One canonical pipeline replaces the two overlapping OutreachHub lead lists. Every action now has an owner, next step, and measurable outcome.</p></div>
      <button className="portal-primary-button" onClick={openNew}><Plus aria-hidden /> Add lead</button>
    </section>
    <section className="portal-metrics" aria-label="Outreach scorecard">
      <MetricCard icon={UsersRound} label="Total leads" value={leads.length} detail="Deduplicated canonical records" tone="accent" />
      <MetricCard icon={Mail} label="Ready to contact" value={ready} detail="Qualified leads with email" tone={ready ? "warning" : "neutral"} />
      <MetricCard icon={MessageSquare} label="Replies" value={replies} detail={`${contacted} contacted`} tone="success" />
      <MetricCard icon={Handshake} label="Partners" value={partners} detail="Verified closed partnerships" tone={partners ? "success" : "neutral"} />
    </section>

    {editingId && <section className="portal-panel crm-editor">
      <div className="portal-panel-heading"><div><span className="portal-kicker">Lead record</span><h2>{editingId === "new" ? "Add potential customer" : "Update lead"}</h2></div></div>
      <form className="portal-form" onSubmit={saveLead}>
        <div className="portal-form-grid crm-form-grid-4">
          <label>Name<input required minLength={2} value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
          <label>Category<select value={draft.category} onChange={(event) => update("category", event.target.value as CrmLead["category"])}>{["restaurant", "retail", "entertainment", "influencer", "agency", "professional", "sponsor", "other"].map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select></label>
          <label>Stage<select value={draft.stage} onChange={(event) => update("stage", event.target.value as CrmStage)}>{stages.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select></label>
          <label>Priority<select value={draft.priority} onChange={(event) => update("priority", event.target.value as CrmLead["priority"])}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
        </div>
        <div className="portal-form-grid crm-form-grid-4">
          <label>Email<input type="email" value={draft.email} onChange={(event) => update("email", event.target.value)} /></label>
          <label>Instagram<input value={draft.instagramHandle} onChange={(event) => update("instagramHandle", event.target.value)} placeholder="handle" /></label>
          <label>Followers<input min="0" type="number" value={draft.followerCount} onChange={(event) => update("followerCount", event.target.value)} /></label>
          <label>Score (1–10)<input min="1" max="10" type="number" value={draft.score} onChange={(event) => update("score", event.target.value)} /></label>
        </div>
        <div className="portal-form-grid crm-form-grid-4">
          <label>City<input value={draft.city} onChange={(event) => update("city", event.target.value)} /></label>
          <label>Borough<input value={draft.borough} onChange={(event) => update("borough", event.target.value)} /></label>
          <label>Contact name<input value={draft.contactName} onChange={(event) => update("contactName", event.target.value)} /></label>
          <label>Owner<input value={draft.ownerName} onChange={(event) => update("ownerName", event.target.value)} /></label>
        </div>
        <label>Website<input type="url" value={draft.websiteUrl} onChange={(event) => update("websiteUrl", event.target.value)} placeholder="https://" /></label>
        <div className="portal-form-grid"><label>Offer<input value={draft.offer} onChange={(event) => update("offer", event.target.value)} /></label><label>Next action<input value={draft.nextAction} onChange={(event) => update("nextAction", event.target.value)} /></label></div>
        <label>Next action time<input type="datetime-local" value={draft.nextActionAt} onChange={(event) => update("nextActionAt", event.target.value)} /></label>
        <label>Notes<textarea rows={3} value={draft.notes} onChange={(event) => update("notes", event.target.value)} /></label>
        <div className="portal-row-actions crm-editor-actions"><button type="button" onClick={() => setEditingId(null)}>Cancel</button><button className="is-primary" disabled={busy}>Save lead</button></div>
      </form>
    </section>}

    <section className="portal-panel">
      <div className="crm-toolbar"><label className="crm-search"><Search aria-hidden /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, email, Instagram…" /></label><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value as "all" | CrmStage)}><option value="all">All stages</option>{stages.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select></div>
      <div className="crm-lead-list">
        {!filtered.length && <EmptyState icon={Target} title="No matching leads" body="Add a high-fit NYC venue or change the current filters." />}
        {filtered.map((lead) => {
          const recentActivity = activities.find((activity) => activity.lead_id === lead.id);
          return <article className="crm-lead-row" key={lead.id}>
            <div className="crm-lead-main"><div className="crm-lead-heading"><strong>{lead.name}</strong><span className={`portal-status is-${lead.stage === "partnered" ? "success" : lead.stage === "replied" || lead.stage === "meeting" || lead.stage === "proposal" ? "warning" : "muted"}`}>{pretty(lead.stage)}</span></div><span>{pretty(lead.category)} · {lead.borough || lead.city || "Location needed"}</span><div className="crm-contact-line">{lead.email && <span><Mail aria-hidden /> {lead.email}</span>}{lead.instagram_handle && <span><AtSign aria-hidden /> {lead.instagram_handle}</span>}{lead.follower_count !== null && <span>{lead.follower_count.toLocaleString()} followers</span>}</div>{lead.next_action && <p><CalendarClock aria-hidden /> <strong>Next:</strong> {lead.next_action}</p>}{recentActivity && <small>Latest: {pretty(recentActivity.activity_type)} · {new Date(recentActivity.occurred_at).toLocaleDateString()}</small>}</div>
            <div className="crm-lead-controls"><select aria-label={`Stage for ${lead.name}`} value={lead.stage} disabled={busy} onChange={(event) => void onAction({ action: "set_crm_stage", targetId: lead.id, crmStage: event.target.value as CrmStage }, `${lead.name} moved to ${pretty(event.target.value)}.`)}>{stages.map((value) => <option key={value} value={value}>{pretty(value)}</option>)}</select><button onClick={() => openEdit(lead)}><Pencil aria-hidden /> Edit</button><button onClick={() => setActivityLeadId(activityLeadId === lead.id ? null : lead.id)}><MessageSquare aria-hidden /> Log</button><button className="is-danger" onClick={() => { if (window.confirm(`Archive ${lead.name}?`)) void onAction({ action: "archive_crm_lead", targetId: lead.id }, "Lead archived."); }}><Archive aria-hidden /></button></div>
            {activityLeadId === lead.id && <div className="crm-activity-composer"><textarea rows={2} value={activityNote} onChange={(event) => setActivityNote(event.target.value)} placeholder="Call notes, reply context, next step…" /><button disabled={busy || !activityNote.trim()} onClick={() => void logNote(lead.id)}>Save activity</button></div>}
          </article>;
        })}
      </div>
    </section>
  </div>;
}
