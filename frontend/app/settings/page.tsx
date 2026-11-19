"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/context/auth-context";
import { planningRequest } from "@/lib/services/planning-api";

interface Profile { id: string; email: string; displayName: string; roles: string[] }
interface Preferences { dietaryPreferences: string[]; allergens: string[]; preferredMaxCookingMinutes: number | null }
const control = "rounded-xl border border-outline-variant bg-surface p-3 disabled:opacity-50";

export default function AccountSettingsPage() {
  const { user, isRestoringSession } = useAuth();
  return <><Navbar /><main className="mx-auto max-w-3xl space-y-6 p-6">
    <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>
    {isRestoringSession ? <p role="status">Đang kiểm tra đăng nhập…</p> : user ? <AccountSettings key={user.id} /> : <Link href="/login" className="underline">Đăng nhập để cập nhật tài khoản</Link>}
  </main><Footer /></>;
}

function AccountSettings() {
  const { updateProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [diet, setDiet] = useState("");
  const [allergens, setAllergens] = useState("");
  const [minutes, setMinutes] = useState("");
  const [loadError, setLoadError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    Promise.all([
      planningRequest<Profile>("users/me", options),
      planningRequest<Preferences>("users/me/preferences", options),
    ]).then(([loadedProfile, loadedPreferences]) => {
      if (controller.signal.aborted) return;
      setProfile(loadedProfile);
      setName(loadedProfile.displayName);
      setPreferences(loadedPreferences);
      setDiet(loadedPreferences.dietaryPreferences.join("\n"));
      setAllergens(loadedPreferences.allergens.join("\n"));
      setMinutes(loadedPreferences.preferredMaxCookingMinutes?.toString() ?? "");
    }).catch((cause) => {
      if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : "Không tải được tài khoản.");
    });
    return () => controller.abort();
  }, [revision]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setBusy(true); setProfileMessage("");
    try {
      await updateProfile({ name });
      setProfile((current) => current && ({ ...current, displayName: name.trim() }));
      setProfileMessage("Đã lưu tên hiển thị.");
    } catch (cause) {
      setProfileMessage(cause instanceof Error ? cause.message : "Không lưu được tên hiển thị.");
    } finally { lock.current = false; setBusy(false); }
  }

  async function savePreferences(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    setPreferencesMessage("");
    const splitLines = (value: string) => [...new Set(value.split("\n").map((line) => line.trim()).filter(Boolean))];
    const dietaryPreferences = splitLines(diet);
    const allergyValues = splitLines(allergens);
    if ([dietaryPreferences, allergyValues].some((values) => values.length > 20 || values.some((value) => value.length > 100))) {
      setPreferencesMessage("Mỗi danh sách tối đa 20 mục, mỗi mục tối đa 100 ký tự.");
      return;
    }
    lock.current = true; setBusy(true);
    try {
      const saved = await planningRequest<Preferences>("users/me/preferences", {
        method: "PUT",
        body: JSON.stringify({ dietaryPreferences, allergens: allergyValues, preferredMaxCookingMinutes: minutes === "" ? null : Number(minutes) }),
      });
      setPreferences(saved);
      setDiet(saved.dietaryPreferences.join("\n"));
      setAllergens(saved.allergens.join("\n"));
      setMinutes(saved.preferredMaxCookingMinutes?.toString() ?? "");
      setPreferencesMessage("Đã lưu tùy chọn ăn uống.");
    } catch (cause) {
      setPreferencesMessage(cause instanceof Error ? cause.message : "Không lưu được tùy chọn.");
    } finally { lock.current = false; setBusy(false); }
  }

  if (!profile || !preferences) return <div className="space-y-3">
    <p role={loadError ? "alert" : "status"}>{loadError || "Đang tải tài khoản…"}</p>
    {loadError && <button className={control} onClick={() => { setLoadError(""); setRevision((value) => value + 1); }}>Thử lại</button>}
  </div>;

  return <>
    <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border border-outline-variant p-5">
      <h2 className="text-xl font-bold">Hồ sơ</h2>
      <p>{profile.email}</p>
      <fieldset disabled={busy} className="space-y-3">
        <label className="block">Tên hiển thị<input className={control + " mt-2 block w-full"} required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} /></label>
        <button className={control} disabled={busy || !name.trim()}>Lưu tên hiển thị</button>
      </fieldset>
      {profileMessage && <p role="status">{profileMessage}</p>}
    </form>
    <PasswordForm />
    <form onSubmit={savePreferences} className="space-y-4 rounded-2xl border border-outline-variant p-5">
      <h2 className="text-xl font-bold">Tùy chọn ăn uống</h2>
      <p>Mỗi dòng một mục, tối đa 20 mục cho mỗi danh sách.</p>
      <fieldset disabled={busy} className="space-y-4">
        <label className="block">Chế độ ăn<textarea className={control + " mt-2 block w-full"} rows={4} value={diet} onChange={(event) => setDiet(event.target.value)} /></label>
        <label className="block">Dị ứng<textarea className={control + " mt-2 block w-full"} rows={4} value={allergens} onChange={(event) => setAllergens(event.target.value)} /></label>
        <label className="block">Thời gian nấu tối đa ưu tiên (phút)<input className={control + " mt-2 block"} type="number" min={1} max={2880} step={1} placeholder="Không giới hạn" value={minutes} onChange={(event) => setMinutes(event.target.value)} /></label>
        <button className={control} disabled={busy}>Lưu tùy chọn ăn uống</button>
      </fieldset>
      {preferencesMessage && <p role="status">{preferencesMessage}</p>}
    </form>
  </>;
}

function PasswordForm() {
  const { logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    if (newPassword !== confirmation) { setError("Mật khẩu xác nhận chưa khớp."); return; }
    lock.current = true; setBusy(true); setError("");
    try {
      await planningRequest("users/me/password", {
        method: "PUT", body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword(""); setNewPassword(""); setConfirmation("");
      logout();
      router.replace("/login?passwordChanged=1");
    } catch {
      setError("Chưa xác nhận được việc đổi mật khẩu. Kiểm tra mật khẩu hiện tại và yêu cầu mật khẩu mới. Nếu kết nối bị ngắt, hãy thử đăng nhập bằng mật khẩu mới.");
    } finally { lock.current = false; setBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border border-outline-variant p-5">
    <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
    <p>Mật khẩu mới dài 12–128 ký tự, gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt. Sau khi đổi, hãy đăng nhập lại.</p>
    <fieldset disabled={busy} className="space-y-3">
      <label className="block">Mật khẩu hiện tại<input className={control + " mt-2 block w-full"} type="password" autoComplete="current-password" required maxLength={128} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
      <label className="block">Mật khẩu mới<input className={control + " mt-2 block w-full"} type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
      <label className="block">Nhập lại mật khẩu mới<input className={control + " mt-2 block w-full"} type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>
      <button className={control} disabled={busy}>{busy ? "Đang đổi mật khẩu…" : "Đổi mật khẩu"}</button>
    </fieldset>
    {error && <p role="alert" className="text-red-700">{error}</p>}
  </form>;
}
