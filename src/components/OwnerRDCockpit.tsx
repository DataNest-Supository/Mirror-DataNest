"use client";

import OwnerDevelopmentAnalytics from "@/components/OwnerDevelopmentAnalytics";

type HealthState = { state:"checking"|"online"|"degraded"|"offline"; checkedAt:string|null; message:string };
type Summary = { total:number; active:number; running:number; blocked:number; available:number; registered:number };
type Job = { id:string; job_number:number; title:string; status:string; priority:number };

export default function OwnerRDCockpit({
  projectId, projectName, counts, jobs, runCount, checkpointCount, eventCount, health, onNavigate
}:{
  projectId:string; projectName:string; counts:Summary; jobs:Job[]; runCount:number; checkpointCount:number; eventCount:number;
  health:HealthState; onNavigate:(view:"overview"|"ai"|"sparks"|"products"|"productlab"|"unifi"|"scheduler"|"runs"|"checkpoints"|"audit"|"settings")=>void;
}) {
  const healthLabel=health.state==="online"?"ONLINE":health.state==="degraded"?"DEGRADED":health.state==="offline"?"OFFLINE":"CHECKING";
  const cards=[
    {label:"Products & Tools",detail:"Evolve the Resonance product portfolio and related tools.",action:"products" as const,glyph:"◉"},
    {label:"Experiments",detail:"Capture and test new ideas without collaborative-workspace overhead.",action:"sparks" as const,glyph:"✧"},
    {label:"DataNest AI",detail:"Use owner-directed AI development and project memory.",action:"ai" as const,glyph:"✦"},
    {label:"Product Lab",detail:"Validate product surfaces before candidate deployment.",action:"productlab" as const,glyph:"▣"},
    {label:"Candidate Deploy",detail:"Prepare independent Mirror candidate execution.",action:"scheduler" as const,glyph:"⌁"},
    {label:"Evidence",detail:"Inspect runtime, recovery and development evidence.",action:"audit" as const,glyph:"≡"}
  ];
  return <div className="dashboardShell">
    <section className="heroPanel">
      <div className="heroCopy">
        <p className="eyebrow">MIRROR · OWNER R&amp;D COCKPIT</p>
        <h2>{projectName}</h2>
        <p>Single-owner development control surface for Resonance DataNest and related products. Build, experiment, inspect live behavior, and ship independent Mirror candidates.</p>
        <div className="heroActions">
          <button className="primaryButton compact" onClick={()=>onNavigate("unifi")}>Build a manifest</button>
          <button className="secondaryButton compact" onClick={()=>onNavigate("products")}>Open product portfolio</button>
          <button className="secondaryButton compact" onClick={()=>onNavigate("ai")}>Open DataNest AI</button>
        </div>
      </div>
      <div className="heroPulse">
        <span className={"badge "+health.state}>{healthLabel}</span>
        <small>{health.message}</small>
      </div>
    </section>

    <section className="metricGrid" aria-label="Owner R&D status">
      <article className="metricCard"><span>Active development</span><strong>{counts.active}</strong><small>{counts.total} total work units</small></article>
      <article className="metricCard"><span>Running now</span><strong>{counts.running}</strong><small>{runCount} execution runs recorded</small></article>
      <article className="metricCard"><span>Needs attention</span><strong>{counts.blocked}</strong><small>Blocked development items</small></article>
      <article className="metricCard"><span>Recovery evidence</span><strong>{checkpointCount}</strong><small>Durable checkpoints</small></article>
    </section>

    <section className="panel">
      <div className="panelHead"><div><p className="eyebrow">DEVELOPMENT SURFACE</p><h3>Build the next Resonance product</h3></div><span className="countPill">{counts.available+" capabilities"}</span></div>
      <div className="workspaceGrid">
        {cards.map(card=><button className="workspaceCard" type="button" key={card.label} onClick={()=>onNavigate(card.action)}>
          <span className="workspaceGlyph" aria-hidden="true">{card.glyph}</span>
          <span><b>{card.label}</b><small>{card.detail}</small></span>
          <span className="workspaceArrow" aria-hidden="true">→</span>
        </button>)}
      </div>
    </section>

    <section className="panel">
      <div className="panelHead"><div><p className="eyebrow">LIVE CANDIDATE CONTROL</p><h3>Current development work</h3></div><button className="textButton" onClick={()=>onNavigate("scheduler")}>Open candidate deploy</button></div>
      {jobs.length ? <div className="jobTable">{jobs.slice(0,6).map(job=><div className="jobTableRow" key={job.id}><b>JOB-{String(job.job_number).padStart(5,"0")}</b><div><strong>{job.title}</strong><small>P{job.priority}</small></div><span><span className={"badge "+job.status.toLowerCase()}>{job.status.replaceAll("_"," ")}</span></span></div>)}</div> : <div className="emptyState"><div>◇</div><h3>No active development work</h3><p>Start with DataNest AI, an experiment, or a build manifest.</p><button className="secondaryButton compact" onClick={()=>onNavigate("ai")}>Start with DataNest AI</button></div>}
    </section>

    <OwnerDevelopmentAnalytics projectId={projectId} compact />

    <section className="panel">
      <div className="panelHead"><div><p className="eyebrow">EVIDENCE</p><h3>Development trace</h3></div><span className="countPill">{eventCount+" events"}</span></div>
      <p className="muted">Mirror evidence remains owner-controlled and independent of the governed collaborative DataNest repository. Use Evidence for traceability; use governed DataNest only when selectively handing work forward.</p>
      <div className="heroActions"><button className="secondaryButton compact" onClick={()=>onNavigate("audit")}>Inspect evidence</button><button className="secondaryButton compact" onClick={()=>onNavigate("settings")}>Owner settings</button></div>
    </section>
  </div>;
}
