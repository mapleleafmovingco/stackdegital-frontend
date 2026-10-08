import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CreditCard } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Stackforge Labs" },
      {
        name: "description",
        content:
          "How Stackforge prices projects: discovery sprints, fixed-scope builds and ongoing retainers.",
      },
      { property: "og:title", content: "Pricing — Stackforge Labs" },
      {
        property: "og:description",
        content: "Clear engagement models, written quotes and secure online payment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PricingPage,
});

// Engagement models only: add real price points here once they are agreed.
const plans = [
  {
    title: "Discovery Sprint",
    price: "Fixed fee",
    desc: "A short, focused engagement to turn an idea into a plan you can build from.",
    items: [
      "Goals & requirements workshop",
      "Technical architecture",
      "Clickable prototype",
      "Written estimate for the build",
    ],
  },
  {
    title: "Fixed-Scope Project",
    price: "Quoted per project",
    desc: "A defined product, a defined price. The most common way clients work with us.",
    items: [
      "Written quote before work starts",
      "Deposit to reserve your slot",
      "Weekly working demos",
      "Progress tracked in your portal",
    ],
    featured: true,
  },
  {
    title: "Ongoing Retainer",
    price: "Monthly",
    desc: "A dedicated team that keeps building, automating and operating after launch.",
    items: [
      "Reserved engineering capacity",
      "Monitoring & maintenance",
      "Roadmap planning",
      "Priority support",
    ],
  },
];

const steps = [
  {
    step: "01",
    title: "Request",
    desc: "Tell us what you want to build in the client portal or by email.",
  },
  {
    step: "02",
    title: "Quote",
    desc: "We scope the work and add a written estimate to your project.",
  },
  {
    step: "03",
    title: "Deposit",
    desc: "Pay the deposit online through Stripe to confirm your start date.",
  },
  { step: "04", title: "Build", desc: "Follow progress and updates in your portal until launch." },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-36">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Pricing</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Clear scope. <span className="text-gradient">Clear price.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Every project is different, so every project gets its own written quote — agreed before
          any work begins.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.title}
            className={`glass-panel flex flex-col rounded-2xl p-8 ${p.featured ? "glow-ring" : ""}`}
          >
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-3 text-3xl font-bold text-primary">{p.price}</p>
            <p className="mt-3 text-muted-foreground">{p.desc}</p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {p.items.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Get a quote <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-bold tracking-tight">How payment works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl border border-border/60 p-7">
              <p className="text-sm font-bold text-primary">{s.step}</p>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-28 text-center">
        <p className="text-muted-foreground">Already have a quote?</p>
        <Link
          to="/pay"
          className="glow-ring mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground"
        >
          <CreditCard className="size-4" /> Make a Payment
        </Link>
      </section>
    </div>
  );
}
