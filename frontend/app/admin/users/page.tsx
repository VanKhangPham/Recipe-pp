"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { planningRequest, PlanningError } from "@/lib/services/planning-api";
import { useAuth } from "@/lib/context/auth-context";
import { backendFetch } from "@/lib/services/api-client";

interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  isLocked: boolean;
  createdAt: string;
}

interface UserPage {
  items: AdminUser[];
  totalCount: number;
}

const pageSize = 20;

export default function AdminUsersPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const mutationLock = useRef(false);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]);
    void backendFetch<UserPage>("/api/v1/admin/users?page=" + page + "&pageSize=" + pageSize, {
      cache: "no-store",
      signal,
    }).then((data) => {
      if (controller.signal.aborted) return;
      setResult(data);
      setLoading(false);
    });
    return () => controller.abort();
  }, [page, revision, user?.id]);

  if (user?.role !== "admin") {
    return <p role="status">Hãy đăng nhập bằng tài khoản Admin để xem danh sách người dùng.</p>;
  }

  const lastPage = Math.max(1, Math.ceil((result?.totalCount ?? 0) / pageSize));

  async function changeAccountStatus(account: AdminUser) {
    const isLocked = !account.isLocked;
    if (isLocked && !window.confirm("Khóa tài khoản " + account.email + "?")) return;

    if (mutationLock.current) return;
    mutationLock.current = true;
    setSavingId(account.id);
    setNotice("");
    try {
      const updated = await backendFetch<AdminUser>("/api/v1/admin/users/" + account.id + "/status", {
        method: "PATCH",
        body: JSON.stringify({ isLocked }),
        signal: AbortSignal.timeout(10_000),
      });
      setNotice(updated
        ? (updated.isLocked ? "Đã khóa tài khoản." : "Đã mở khóa tài khoản.")
        : "Chưa xác nhận được thay đổi. Kiểm tra quyền Admin và trạng thái tài khoản.");
      setLoading(true);
      setRevision((value) => value + 1);
    } finally {
      mutationLock.current = false;
      setSavingId(null);
    }
  }

  async function changeAdminRole(account: AdminUser) {
    const isAdmin = !account.roles.includes("Admin");
    const action = isAdmin ? "Cấp quyền Admin cho " : "Thu hồi quyền Admin của ";
    if (mutationLock.current || !window.confirm(action + account.email + "? Tài khoản cần đăng nhập lại để cập nhật giao diện.")) return;
    mutationLock.current = true;
    setSavingId(account.id);
    setNotice("");
    try {
      await planningRequest<AdminUser>("admin/users/" + account.id + "/admin", {
        method: "PATCH", body: JSON.stringify({ isAdmin }),
      });
      if (account.id === user?.id && !isAdmin) {
        logout();
        router.replace("/login");
        return;
      }
      setNotice(isAdmin ? "Đã cấp quyền Admin." : "Đã thu hồi quyền Admin.");
      setLoading(true);
      setRevision((value) => value + 1);
    } catch (cause) {
      setNotice(cause instanceof PlanningError && cause.status === 409
        ? "Không thay đổi được quyền. Phải giữ ít nhất một Admin đang hoạt động. Làm mới để đối chiếu."
        : "Chưa xác nhận được thay đổi quyền. Kiểm tra kết nối và đăng nhập lại.");
    } finally {
      mutationLock.current = false;
      setSavingId(null);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-headline-lg text-headline-lg font-bold">Quản lý người dùng</h1>
        <button
          type="button"
          className="rounded-xl bg-primary px-4 py-2 text-on-primary"
          onClick={() => {
            setLoading(true);
            setRevision((value) => value + 1);
          }}
        >
          Làm mới
        </button>
      </header>
      {notice && <p role="status">{notice}</p>}
      {loading ? <p role="status">Đang tải danh sách…</p> : !result ? (
        <p role="status">Chưa tải được danh sách. Hãy kiểm tra kết nối API và đăng nhập bằng tài khoản Admin.</p>
      ) : result.items.length === 0 ? <p>Không có người dùng trên trang này.</p> : (
        <div className="overflow-x-auto rounded-xl bg-surface-container-lowest">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container">
                <th scope="col" className="p-3">Tên hiển thị</th>
                <th scope="col" className="p-3">Email</th>
                <th scope="col" className="p-3">Vai trò</th>
                <th scope="col" className="p-3">Trạng thái</th>
                <th scope="col" className="p-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((account) => (
                <tr key={account.id} className="border-t border-surface-container">
                  <td className="p-3">{account.displayName}</td>
                  <td className="p-3">{account.email}</td>
                  <td className="p-3">{account.roles.join(", ") || "—"}</td>
                  <td className="p-3">{account.isLocked ? "Đã khóa" : "Hoạt động"}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      disabled={savingId !== null || (!account.isLocked && account.id === user.id)}
                      className="text-primary disabled:opacity-50"
                      onClick={() => void changeAccountStatus(account)}
                    >
                      {savingId === account.id ? "Đang lưu…" : account.isLocked ? "Mở khóa" : "Khóa tài khoản"}
                    </button>
                    <button type="button" disabled={savingId !== null} className="ml-4 text-primary disabled:opacity-50" onClick={() => void changeAdminRole(account)}>
                      {account.roles.includes("Admin") ? "Thu hồi Admin" : "Cấp quyền Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center gap-4">
        <button type="button" disabled={savingId !== null || loading || page === 1} className="text-primary disabled:opacity-50" onClick={() => {
          setLoading(true);
          setPage(page - 1);
        }}>Trang trước</button>
        <span>Trang {page}/{lastPage}</span>
        <button type="button" disabled={savingId !== null || loading || page >= lastPage} className="text-primary disabled:opacity-50" onClick={() => {
          setLoading(true);
          setPage(page + 1);
        }}>Trang sau</button>
      </div>
    </section>
  );
}
