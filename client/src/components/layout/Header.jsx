
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  BookOpen,
  ChevronRight,
} from "lucide-react";

export default function Header({
  user,
  onAuth,
  onLogout,
  onHome,
  onDashboard,
}) {
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-sm shadow-slate-200/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={onHome}
          aria-label="Go to homepage"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg shadow-blue-700/25 transition duration-300 group-hover:scale-105 group-hover:shadow-blue-700/40">
            <GraduationCap size={26} strokeWidth={2.2} />
          </span>

          <span className="text-left">
            <span className="block text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Campus<span className="text-blue-700">Review</span>
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-slate-500 sm:block">
              FIND YOUR NEXT OPPORTUNITY
            </span>
          </span>
        </button>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1.5 sm:gap-3"
        >
          <button
            type="button"
            onClick={onHome}
            className="group hidden items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:flex"
          >
            <BookOpen
              size={18}
              className="transition group-hover:-translate-y-0.5"
            />
            Colleges
          </button>

          {user ? (
            <>
              {/* User profile */}
              <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-4 md:flex">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-extrabold text-blue-800 ring-2 ring-white">
                  {(user.name || user.email || "U")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}

                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div className="max-w-36 text-left">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {user.name || user.email || "Account"}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs capitalize text-slate-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isAdmin ? "bg-violet-500" : "bg-blue-500"
                      }`}
                    />
                    {user.role || "User"}
                  </p>
                </div>
              </div>

              {/* Dashboard */}
              <button
                type="button"
                onClick={onDashboard}
                className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition duration-200 sm:px-4 ${
                  isAdmin
                    ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <LayoutDashboard
                  size={18}
                  className="transition group-hover:scale-110"
                />
                <span className="hidden sm:inline">
                  {isAdmin ? "Admin Dashboard" : "My Reviews"}
                </span>
                <span className="sm:hidden">
                  {isAdmin ? "Admin" : "Reviews"}
                </span>
                <ChevronRight
                  size={15}
                  className="hidden opacity-60 transition group-hover:translate-x-0.5 sm:block"
                />
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:h-11 sm:w-11"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onAuth("login")}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-700/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-700/30 sm:px-5"
            >
              Sign in
              <ChevronRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
