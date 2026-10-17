
import { useState } from "react";
import { X, GraduationCap, ShieldCheck } from "lucide-react";
import api from "../../services/api";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import toast from "react-hot-toast";

export default function AuthModal({
  mode = "login",
  onClose,
  onSwitch,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isLogin = mode === "login";

  async function handleSubmit(form) {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      
if (isLogin) {
  const response = await api.post("/auth/login", form);
  const payload = response.data;

  const token =
    payload.token ||
    payload.accessToken ||
    payload.data?.token ||
    payload.data?.accessToken;

  let user =
    payload.user ||
    payload.data?.user ||
    (payload.data?._id ? payload.data : null);

  if (!token) {
    throw new Error("Login succeeded without an authentication token.");
  }

  localStorage.setItem("token", token);

  if (!user) {
    const meResponse = await api.get("/auth/me");
    const mePayload = meResponse.data;

    user =
      mePayload.user ||
      mePayload.data?.user ||
      (mePayload.data?._id ? mePayload.data : null) ||
      (mePayload._id ? mePayload : null);
  }

  if (!user || typeof user !== "object" || !user.role) {
    localStorage.removeItem("token");
    throw new Error("Could not retrieve your user profile and role.");
  }

  localStorage.setItem("user", JSON.stringify(user));
  toast.success(`Welcome, ${user.name || "back"}!`);
   onSuccess?.(user, token);
   } else {
        await api.post("/auth/register", form);

   toast.success("Account created successfully! Please sign in.");
   onSwitch?.("login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setError("");
    setNotice("");
    onSwitch?.(nextMode);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative my-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <GraduationCap size={30} />
          </div>

          <h2
            id="auth-modal-title"
            className="text-2xl font-extrabold tracking-tight text-slate-900"
          >
            {isLogin ? "Welcome back!" : "Join CampusReview"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {isLogin
              ? "Sign in to continue your college review journey."
              : "Create an account to share your college experience."}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {notice}
          </div>
        )}

        {isLogin ? (
          <LoginForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <RegisterForm onSubmit={handleSubmit} loading={loading} />
        )}

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(isLogin ? "register" : "login")}
            className="font-bold text-blue-700 hover:text-blue-900"
          >
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={15} />
          <span>Your account details are handled securely.</span>
        </div>
      </div>
    </div>
  );
}
