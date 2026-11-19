"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";

export type GatedActionType = "publish" | "comment" | "follow";
export interface LoginRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType?: GatedActionType;
  returnUrl?: string;
  onSuccess?: () => void;
}

export function LoginRequiredDialog({ isOpen, onClose, actionType = "publish", returnUrl = "/recipes/new", onSuccess }: LoginRequiredDialogProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const dialog = useRef<HTMLDivElement>(null);
  const destination = returnUrl.startsWith("/") && !returnUrl.startsWith("//") && !returnUrl.includes(String.fromCharCode(92)) ? returnUrl : "/recipes";
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.current?.querySelector<HTMLInputElement>("input")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !lock.current) onClose();
      if (event.key !== "Tab") return;
      const elements = dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), a[href]");
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => { window.removeEventListener("keydown", handleKey); previousFocus?.focus(); };
  }, [isOpen, onClose]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try {
      await login(email, password);
      setPassword("");
      onSuccess?.();
      onClose();
      router.push(destination);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể đăng nhập.");
    } finally { lock.current = false; setBusy(false); }
  }
  if (!isOpen) return null;
  const title = actionType === "comment" ? "Đăng nhập để gửi đánh giá" : actionType === "follow" ? "Đăng nhập để theo dõi" : "Đăng nhập để đăng công thức";
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="login-required-title" className="w-full max-w-md space-y-4 rounded-2xl bg-surface p-6 shadow-xl">
      <h2 id="login-required-title" className="text-xl font-bold">{title}</h2>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">Email<input className="mt-2 w-full rounded-xl border p-3" type="email" autoComplete="username" required maxLength={254} disabled={busy} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="block">Mật khẩu<input className="mt-2 w-full rounded-xl border p-3" type="password" autoComplete="current-password" required maxLength={128} disabled={busy} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p role="alert" className="text-error">{error}</p>}
        <div className="flex gap-3">
          <button className="rounded-xl bg-primary px-4 py-2 text-on-primary disabled:opacity-50" disabled={busy}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button>
          <button className="rounded-xl border px-4 py-2" type="button" disabled={busy} onClick={onClose}>Đóng</button>
        </div>
      </form>
      <Link href="/register" className="underline">Đăng ký tài khoản</Link>
    </div>
  </div>;
}
