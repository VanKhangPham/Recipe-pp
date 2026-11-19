import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function VerifyEmailPage() {
  return <><Navbar /><main className="mx-auto w-full max-w-xl space-y-5 p-6">
    <h1 className="text-3xl font-bold">Xác minh email</h1>
    <p>Xác minh email qua liên kết hiện chưa khả dụng.</p>
    <Link className="inline-block rounded-xl border p-3" href="/login">Về đăng nhập</Link>
  </main><Footer /></>;
}
