import { supabase } from "@/integrations/supabase/client";

// The payment backend (Express + Stripe). It owns the price: the browser only
// ever sends a project ID and receives a Stripe Checkout URL.
const API_URL = (
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:4000"
).replace(/\/+$/, "");

export type DepositStatus = "not_started" | "pending" | "paid" | "needs_review" | "refunded";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in again.");

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("The payment service is unreachable. Please try again shortly.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Something went wrong");
  return body as T;
}

export const startDepositCheckout = (projectId: string) =>
  api<{ url: string }>("/api/payments/deposit", {
    method: "POST",
    body: JSON.stringify({ projectId }),
  });

export const getDepositStatus = (projectId: string) =>
  api<{
    projectId: string;
    depositStatus: DepositStatus;
    depositCents: number | null;
    currency: string;
  }>(`/api/payments/deposit/${projectId}`);

export const formatMoney = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100,
  );
