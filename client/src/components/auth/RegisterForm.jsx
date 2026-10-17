
import { useState } from "react";
import {
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

export default function RegisterForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: form.password.length >= 8,
    },
    {
      label: "One uppercase letter (A-Z)",
      valid: /[A-Z]/.test(form.password),
    },
    {
      label: "One lowercase letter (a-z)",
      valid: /[a-z]/.test(form.password),
    },
    {
      label: "One number (0-9)",
      valid: /\d/.test(form.password),
    },
    {
      label: "One special character (!@#$%)",
      valid: /[^A-Za-z0-9]/.test(form.password),
    },
  ];

  const strength = passwordChecks.filter((check) => check.valid).length;

  const strengthInfo = [
    { label: "", color: "bg-slate-200", text: "text-slate-500" },
    { label: "Very weak", color: "bg-red-500", text: "text-red-600" },
    { label: "Weak", color: "bg-orange-500", text: "text-orange-600" },
    { label: "Fair", color: "bg-yellow-500", text: "text-yellow-700" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Very strong", color: "bg-green-600", text: "text-green-700" },
  ];

  const currentStrength = strengthInfo[strength];

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    if (form.name.trim().length < 2) {
      return;
    }

    if (!passwordChecks.every((check) => check.valid)) {
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full name */}
      <div>
        <label
          htmlFor="register-name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Full name
        </label>

        <div className="relative">
          <UserRound
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            minLength={2}
            required
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {submitted && form.name.trim().length < 2 && (
          <p className="mt-1.5 text-xs text-red-600">
            Please enter at least 2 characters.
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="register-password"
            className="text-sm font-semibold text-slate-700"
          >
            Create password
          </label>

          <ShieldCheck size={17} className="text-blue-600" />
        </div>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-describedby="password-strength password-requirements"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password strength */}
        {form.password.length > 0 && (
          <div id="password-strength" className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Password strength
              </span>

              <span
                className={`text-xs font-bold ${currentStrength.text}`}
              >
                {currentStrength.label}
              </span>
            </div>

            <div className="flex gap-1.5">
              {strengthInfo.slice(1).map((item, index) => (
                <div
                  key={item.label}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    strength >= index + 1
                      ? item.color
                      : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        <div
          id="password-requirements"
          className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5"
        >
        </div>

       
{submitted && strength < 5 && (
  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
    Password must contain at least 8 characters,
    one uppercase letter, one lowercase letter,
    one number, and one special character.
  </p>
)}

      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-700/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-700/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <ShieldCheck size={18} />
            Create account
          </>
        )}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Your account will be created with the{" "}
        <span className="font-semibold text-blue-700">student</span> role.
      </p>
    </form>
  );
}
