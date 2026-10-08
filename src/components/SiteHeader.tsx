import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Braces, CreditCard, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/portal", label: "Client Portal" },
] as const;

export function SiteHeader() {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const linkCls = "transition-colors hover:text-foreground";
  const close = () => setOpen(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link to="/" onClick={close} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Braces className="size-4" />
          </span>
          Stackforge
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={{ className: "text-foreground" }}>{l.label}</Link>
          ))}
          {isAdmin && <Link to="/admin" className={linkCls} activeProps={{ className: "text-foreground" }}>Admin</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/pay"
            onClick={close}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
          >
            <CreditCard className="size-4" /> Make a Payment
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border/60 bg-background px-6 py-3 text-sm text-muted-foreground lg:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={close} className={`block py-2.5 ${linkCls}`} activeProps={{ className: "text-foreground" }}>{l.label}</Link>
          ))}
          {isAdmin && <Link to="/admin" onClick={close} className={`block py-2.5 ${linkCls}`} activeProps={{ className: "text-foreground" }}>Admin</Link>}
        </nav>
      )}
    </header>
  );
}
