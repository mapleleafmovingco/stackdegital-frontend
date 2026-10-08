import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, LayoutDashboard, Mail } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Stackforge Labs" },
      {
        name: "description",
        content:
          "Tell Stackforge what you want to build. We'll map the fastest route from idea to product.",
      },
      { property: "og:title", content: "Contact — Stackforge Labs" },
      { property: "og:description", content: "Have something to build? Let's talk." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

const EMAIL = "hello@stackforge.dev";

function ContactPage() {
  const [form, setForm] = useState({ name: "", subject: "", message: "" });
  const field =
    "w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary";

  // No contact backend yet: hand the message to the visitor's own mail app.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-36">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Contact</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Have something to build? <span className="text-gradient">Let's talk.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Tell us where you want to go — we'll map the fastest route from idea to a product your
          users love.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-28 md:grid-cols-5">
        <form onSubmit={submit} className="glass-panel space-y-3 rounded-2xl p-8 md:col-span-3">
          <input
            required
            className={field}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            className={field}
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            required
            className={field}
            rows={6}
            placeholder="What do you want to build?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground">
            Open in your email app <ArrowRight className="size-4" />
          </button>
        </form>
        <div className="space-y-5 md:col-span-2">
          <a
            href={`mailto:${EMAIL}`}
            className="glass-panel block rounded-2xl p-8 transition-colors hover:bg-secondary"
          >
            <Mail className="size-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">Email us</h2>
            <p className="mt-1 text-sm text-muted-foreground">{EMAIL}</p>
          </a>
          <Link
            to="/portal"
            className="glass-panel block rounded-2xl p-8 transition-colors hover:bg-secondary"
          >
            <LayoutDashboard className="size-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">Already a client?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit requests and follow progress in the client portal.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
