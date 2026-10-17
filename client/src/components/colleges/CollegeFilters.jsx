
import { Search, MapPin, X } from "lucide-react";

export default function CollegeFilters({
  search,
  setSearch,
  location,
  setLocation,
  locations,
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_220px_auto]">
      <div className="relative">
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search colleges..."
          aria-label="Search colleges"
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="relative">
        <MapPin
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-label="Filter by location"
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All locations</option>
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => {
          setSearch("");
          setLocation("");
        }}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        <X size={17} />
        Clear
      </button>
    </div>
  );
}
