import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Handshake, Rocket, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Stackforge Labs" },
      {
        name: "description",
        content:
          "Stackforge is a tech studio building full-stack web applications, AI automations and digital design.",
      },
      { property: "og:title", content: "About — Stackforge Labs" },
      {
        property: "og:description",
        content: "One accountable team across every layer of your product.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Rocket,
    title: "Working software, weekly",
    desc: "You see real progress in tight iterations — not a big reveal at the end of the quarter.",
  },
  {
    icon: Eye,
    title: "Nothing hidden",
    desc: "Status, updates and what's due are always visible in your client portal.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    desc: "Authentication, access control and payment handling are designed in from day one, not bolted on.",
  },
  {
    icon: Handshake,
    title: "Partners past launch",
    desc: "We stay on to measure, automate and grow the product long after v1 ships.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-36">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">About</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          One studio for <span className="text-gradient">every layer of your product</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Stackforge is a tech studio crafting full-stack web apps, AI automations and digital
          design. We take products from first sketch to production scale with one accountable team —
          so nothing gets lost between the designer, the developer and the people running it.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 md:grid-cols-2">
        {values.map((v) => (
          <div key={v.title} className="glass-panel rounded-2xl p-8">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <v.icon className="size-6" />
            </span>
            <h2 className="mt-6 text-xl font-semibold">{v.title}</h2>
            <p className="mt-2 text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-28 text-center">
        <Link
          to="/contact"
          className="glow-ring inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground"
        >
          Talk to us <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
