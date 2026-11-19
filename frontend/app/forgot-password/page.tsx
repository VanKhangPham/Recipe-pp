import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ForgotPasswordPage() {
  return <><Navbar /><main className="mx-auto w-full max-w-xl space-y-5 p-6">
    <h1 className="text-3xl font-bold">Khôi phục mật khẩu</h1>
    <p>Khôi phục mật khẩu qua email hiện chưa khả dụng.</p>
    <p>Nếu vẫn đăng nhập được, bạn có thể đổi mật khẩu trong Cài đặt tài khoản bằng mật khẩu hiện tại.</p>
    <div className="flex flex-wrap gap-4">
      <Link className="rounded-xl border p-3" href="/login">Về đăng nhập</Link>
      <Link className="rounded-xl border p-3" href="/settings">Cài đặt tài khoản</Link>
    </div>
  </main><Footer /></>;
}
