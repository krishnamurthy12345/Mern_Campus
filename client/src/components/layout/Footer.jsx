
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap size={21} className="text-blue-700" />
          <span className="font-bold text-slate-800">
            CampusReview
          </span>
        </div>

        <p className="text-sm text-slate-500">
          Make informed decisions about your education.
        </p>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} CampusReview
        </p>
      </div>
    </footer>
  );
}
