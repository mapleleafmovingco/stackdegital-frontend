import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Stackforge Labs" },
      {
        name: "description",
        content: "Selected Stackforge work across web platforms, AI automation, data and design.",
      },
      { property: "og:title", content: "Portfolio — Stackforge Labs" },
      { property: "og:description", content: "The kind of products we design, build and operate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortfolioPage,
});

// Placeholder case studies: replace with real client work before launch.
const work = [
  {
    tag: "Web App",
    title: "Client portal for a logistics operator",
    desc: "Shipment tracking, document exchange and invoicing in one authenticated portal, replacing a shared inbox.",
    stack: ["React", "TypeScript", "PostgreSQL"],
  },
  {
    tag: "AI Automation",
    title: "Document intake agent for a professional services firm",
    desc: "Reads incoming contracts and forms, extracts the fields that matter and routes them to the right team.",
    stack: ["LLM pipelines", "RAG", "Guardrails"],
  },
  {
    tag: "Integration",
    title: "Payments and CRM sync for a subscription business",
    desc: "Stripe, CRM and accounting kept in step through signed webhooks — no more month-end reconciliation by hand.",
    stack: ["Stripe", "Webhooks", "Node.js"],
  },
  {
    tag: "Data & Analytics",
    title: "Operations dashboard for a multi-site retailer",
    desc: "A single source of truth for sales, stock and staffing, refreshed in near real time.",
    stack: ["Warehouse", "ETL", "BI"],
  },
  {
    tag: "Mobile App",
    title: "Field service app with offline sync",
    desc: "Technicians complete jobs with no signal and everything syncs when they're back in range.",
    stack: ["iOS", "Android", "Offline sync"],
  },
  {
    tag: "Design",
    title: "Design system for a growing SaaS team",
    desc: "Tokens, components and documentation that let four product squads ship a consistent interface.",
    stack: ["UX research", "Design system", "WCAG"],
  },
];

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-36">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Portfolio</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Work that <span className="text-gradient">ships and stays shipped</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          A selection of the products, automations and systems we've designed, built and continue to
          operate.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {work.map((w) => (
          <div key={w.title} className="glass-panel flex flex-col rounded-2xl p-8">
            <span className="self-start rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
              {w.tag}
            </span>
            <h2 className="mt-5 text-xl font-semibold">{w.title}</h2>
            <p className="mt-2 flex-1 text-muted-foreground">{w.desc}</p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {w.stack.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-28 text-center">
        <Link
          to="/contact"
          className="glow-ring inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground"
        >
          Start a project <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
