import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";
import { formatMoney, getDepositStatus, startDepositCheckout } from "@/lib/payments";
import type { Tables } from "@/integrations/supabase/types";

type PaySearch = { checkout?: "return" | "cancelled"; project?: string };

export const Route = createFileRoute("/pay")({
  validateSearch: (s: Record<string, unknown>): PaySearch => {
    const { checkout, project } = s;
    return {
      ...((checkout === "return" || checkout === "cancelled") && { checkout }),
      ...(typeof project === "string" && { project }),
    };
  },
  head: () => ({
    meta: [
      { title: "Make a Payment — Stack Digital Labs" },
      {
        name: "description",
        content: "Pay your Stack Digital project deposit securely through Stripe.",
      },
      { property: "og:title", content: "Make a Payment — Stack Digital Labs" },
      { property: "og:description", content: "Secure project payments, processed by Stripe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PayPage,
});

// How long the return page waits for Stripe's webhook to reach the backend.
const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 15;

function PayPage() {
  const { user, loading } = useAuth();
  const { checkout, project: returnedProject } = Route.useSearch();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Tables<"projects">[] | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<"waiting" | "paid" | "slow" | null>(null);

  const load = () =>
    user &&
    supabase
      .from("projects")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProjects(data ?? []));

  useEffect(() => {
    void load();
  }, [user]);

  // Back from Stripe. The redirect proves nothing: only the backend, once the
  // signed webhook has arrived, can say the deposit is paid.
  useEffect(() => {
    if (!user || !checkout) return;
    if (checkout === "cancelled") {
      toast.info("Checkout cancelled — you have not been charged.");
      navigate({ to: "/pay", search: {}, replace: true });
      return;
    }
    if (!returnedProject) return;
    let stop = false;
    setConfirming("waiting");
    (async () => {
      for (let i = 0; i < POLL_ATTEMPTS && !stop; i++) {
        const status = await getDepositStatus(returnedProject).catch(() => null);
        if (stop) return;
        if (status?.depositStatus === "paid" || status?.depositStatus === "needs_review") {
          setConfirming(status.depositStatus === "paid" ? "paid" : null);
          void load();
          return;
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
      if (!stop) setConfirming("slow");
    })();
    return () => {
      stop = true;
    };
  }, [user, checkout, returnedProject]);

  const pay = async (projectId: string) => {
    setPaying(projectId);
    try {
      const { url } = await startDepositCheckout(projectId);
      window.location.assign(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start payment");
      setPaying(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Make a payment</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Pay your project deposit <span className="text-gradient">securely</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Choose a project below and you'll be taken to Stripe's hosted checkout to complete the
          payment.
        </p>

        {confirming && (
          <div className="glass-panel mt-8 flex items-center gap-3 rounded-2xl p-5 text-sm">
            {confirming === "paid" ? (
              <CheckCircle2 className="size-5 text-primary" />
            ) : (
              <Loader2 className="size-5 animate-spin text-primary" />
            )}
            {confirming === "waiting" && "Confirming your payment with Stripe…"}
            {confirming === "paid" &&
              "Payment received — thank you. A receipt is on its way to your inbox."}
            {confirming === "slow" &&
              "Your payment is still being confirmed. This page will show it as paid once Stripe notifies us — you don't need to pay again."}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {!loading && !user && (
            <div className="glass-panel rounded-2xl p-8 text-center">
              <Lock className="mx-auto size-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">Sign in to see what's due</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Payments are tied to your client account, so we can match them to the right project.
              </p>
              <Link
                to="/auth"
                search={{ next: "pay" }}
                className="glow-ring mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Sign in <ArrowRight className="size-4" />
              </Link>
            </div>
          )}

          {user && projects?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              You don't have any projects yet.{" "}
              <Link to="/portal" className="text-primary hover:underline">
                Request one in the client portal.
              </Link>
            </div>
          )}

          {user &&
            projects?.map((p) => {
              const deposit = p.estimate_cents
                ? Math.round((p.estimate_cents * p.deposit_percent) / 100)
                : null;
              const payable =
                deposit !== null &&
                (p.deposit_status === "not_started" || p.deposit_status === "pending");
              return (
                <div
                  key={p.id}
                  className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{p.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {deposit === null
                        ? "Awaiting your quote — nothing is due yet."
                        : `${p.deposit_percent}% deposit on ${formatMoney(p.estimate_cents!, p.currency)} estimate`}
                    </p>
                  </div>
                  {payable && (
                    <button
                      onClick={() => pay(p.id)}
                      disabled={paying !== null}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
                    >
                      {paying === p.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Lock className="size-4" />
                      )}
                      Pay {formatMoney(deposit, p.currency)}
                    </button>
                  )}
                  {deposit !== null && p.deposit_status === "paid" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
                      <CheckCircle2 className="size-3.5" /> Deposit paid
                    </span>
                  )}
                  {deposit !== null &&
                    (p.deposit_status === "needs_review" || p.deposit_status === "refunded") && (
                      <Link
                        to="/contact"
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        {p.deposit_status === "refunded" ? "Refunded" : "Under review"} — contact us
                      </Link>
                    )}
                </div>
              );
            })}
        </div>

        <p className="mt-10 flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          Payments are processed by Stripe. Your card details are entered on Stripe's checkout page
          and never touch our servers. The amount is set from your project quote and can't be
          changed in the browser.
        </p>
      </div>
    </div>
  );
}
