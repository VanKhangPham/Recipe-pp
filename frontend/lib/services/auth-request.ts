import { authenticatedFetch, fetchCsrfToken } from "./api-client";

// Authentication errors need actionable messages without exposing server internals.
export async function authRequest<T>(action: "login" | "register", body: object): Promise<T> {
  let response: Response;
  try {
    const csrf = await fetchCsrfToken();
    if (!csrf) throw new Error("csrf unavailable");
    response = await authenticatedFetch(`/api/v1/auth/${action}`, {
      method: "POST", headers: { "X-CSRF-TOKEN": csrf }, body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Không kết nối được dịch vụ tài khoản. Vui lòng thử lại sau.");
  }
  if (!response.ok) {
    const message = response.status === 409 && action === "register"
      ? "Email này đã được sử dụng. Hãy đăng nhập bằng tài khoản đã có."
      : response.status === 401
      ? "Email hoặc mật khẩu không đúng, hoặc tài khoản đang bị khóa tạm thời."
      : response.status === 429
      ? "Bạn đã thử quá nhiều lần. Vui lòng chờ trước khi thử lại."
      : response.status === 400
      ? "Thông tin chưa hợp lệ. Kiểm tra email và các yêu cầu mật khẩu."
      : response.status === 403
      ? "Không xác minh được yêu cầu. Tải lại trang rồi thử lại."
      : "Dịch vụ tài khoản đang gặp sự cố. Vui lòng thử lại sau.";
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}
