import { ArrowUp, CheckCircle2, Component, Inbox, Zap } from "lucide-react";

type StatCard = {
  label: string;
  value: string;
  trend: string;
  detail: string;
  tone: "orange" | "blue" | "green" | "amber";
  icon: typeof Component;
};

const statCards: StatCard[] = [
  {
    label: "Active projects",
    value: "24",
    trend: "+12.4%",
    detail: "Compared with last month",
    tone: "orange",
    icon: Component,
  },
  {
    label: "Components shipped",
    value: "64",
    trend: "+8 this week",
    detail: "Across the current release",
    tone: "blue",
    icon: Zap,
  },
  {
    label: "Team velocity",
    value: "86%",
    trend: "+5.2%",
    detail: "Across active workspaces",
    tone: "green",
    icon: CheckCircle2,
  },
  {
    label: "Open reviews",
    value: "08",
    trend: "2 pending",
    detail: "Ready for your attention",
    tone: "amber",
    icon: Inbox,
  },
];

export function ShowcaseStatCards() {
  return (
    <section className="kit-section stat-cards-section" id="stats" aria-labelledby="stats-title">
      <header className="section-heading">
        <span>Workspace snapshot</span>
        <h2 id="stats-title">Workspace pulse</h2>
        <p>Keep the most useful signals visible with tactile cards that make status easy to scan.</p>
      </header>
      <div className="stat-card-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className={`panel stat-card ${stat.tone}`} key={stat.label}>
              <div className="stat-card-header">
                <span className={`stat-card-icon ${stat.tone}`} aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="stat-card-trend">
                  <ArrowUp size={13} /> {stat.trend}
                </span>
              </div>
              <div className="stat-card-value">
                <h3>{stat.label}</h3>
                <strong>{stat.value}</strong>
              </div>
              <div className="stat-card-footer">
                <span>{stat.detail}</span>
                <span className="stat-card-spark" aria-hidden="true">
                  {[35, 52, 42, 68, 57, 78].map((height, index) => (
                    <i key={`${stat.label}-${index}`} style={{ height: `${height}%` }} />
                  ))}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
