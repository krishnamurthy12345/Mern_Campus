
import { MapPin, Star, ArrowRight, GraduationCap } from "lucide-react";

export default function CollegeCard({ college, onViewDetails }) {
  const name = college.name || college.collegeName || "Unnamed College";
  const location =
    college.location ||
    [college.city, college.state].filter(Boolean).join(", ") ||
    "Location unavailable";

  const rating = Number(college.averageRating ?? college.rating ?? 0);
  const reviewCount = Number(
    college.reviewCount ?? college.totalReviews ?? 0
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-slate-100">
        {college.image ? (
          <img
            src={college.image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <GraduationCap
            size={64}
            strokeWidth={1.2}
            className="text-blue-700/70"
          />
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
            {name}
          </h3>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-sm font-bold text-amber-700">
            <Star size={14} fill="currentColor" />
            {rating.toFixed(1)}
          </div>
        </div>

        <p className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={16} className="shrink-0" />
          <span>{location}</span>
        </p>

        <p className="mb-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
          {college.description || "Explore this college and read student reviews."}
        </p>

        <div className="mb-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(college)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          View College
          <ArrowRight size={17} />
        </button>
      </div>
    </article>
  );
}
