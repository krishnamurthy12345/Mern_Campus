
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  GraduationCap,
  ArrowRight,
  Star,
} from "lucide-react";

import { getColleges } from "../services/collegeService";

function Home({ user, onOpenCollege, onAuth }) {

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        setError("");
     
        
         const response = await getColleges();

     const colleges = Array.isArray(response.data)
            ? response.data
            : response.data.data || [];

     setColleges(colleges);

     console.log("Colleges loaded:", colleges);

      } catch (err) {
        console.error("Failed to fetch colleges:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load colleges. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const filteredColleges = colleges.filter((college) => {
    const searchText = search.toLowerCase();

    return (
      (college.name || "").toLowerCase().includes(searchText) ||
      (college.location || "").toLowerCase().includes(searchText) ||
      (college.city || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-800">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-indigo-100">
              <GraduationCap size={18} />
              Your journey starts here
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your
              <span className="block text-sky-300">
                Dream College
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-indigo-100 sm:text-lg">
              Explore colleges, compare your options, and
              read student reviews to make the right decision
              for your future.
            </p>

            {user && (
              <p className="mt-4 font-medium text-white">
                Welcome back,{" "}
                {user.name || user.username || "Student"}!
              </p>
            )}

            <a
              href="#colleges"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-100"
            >
              Explore Colleges
              <ArrowRight size={18} />
            </a>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-indigo-100">
              <span className="flex items-center gap-2">
                <Star size={16} className="text-yellow-300" />
                Student reviews
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap size={18} />
                College discovery
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85"
                alt="University campus"
                className="h-72 w-full rounded-2xl object-cover sm:h-96"
              />

              <div className="absolute -bottom-5 left-0 rounded-2xl bg-white p-4 shadow-xl sm:-left-5 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                    <GraduationCap size={25} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      Your future, your choice
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Find the right place to learn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Listing */}
      <section
        id="colleges"
        className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Find your destination
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore Colleges
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-slate-500">
              Discover institutions and explore their details
              before making your next big decision.
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:max-w-sm">
            <Search size={20} className="shrink-0 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search college or location..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              aria-label="Search colleges"
            />
          </div>
        </div>

        {!loading && !error && (
          <p className="mt-8 text-sm text-slate-500">
            Showing {filteredColleges.length}{" "}
            {filteredColleges.length === 1 ? "college" : "colleges"}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-7 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-52 bg-slate-200" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredColleges.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <GraduationCap
              size={42}
              className="mx-auto text-slate-400"
            />
            <h3 className="mt-4 text-xl font-bold text-slate-800">
              {search ? "No matching colleges" : "No colleges available"}
            </h3>
            <p className="mt-2 text-slate-500">
              {search
                ? "Try another college name or location."
                : "Colleges will appear here once they are available."}
            </p>
          </div>
        )}

        {!loading && !error && filteredColleges.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredColleges.map((college) => (
              <article
                key={college._id || college.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden bg-indigo-100">
                  {college.image ? (
                    <img
                      src={college.image}
                      alt={college.name || "College campus"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-sky-100">
                      <GraduationCap
                        size={64}
                        className="text-indigo-400"
                      />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                    College
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                    {college.name || "Unnamed College"}
                  </h3>

                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin
                      size={16}
                      className="shrink-0 text-indigo-500"
                    />
                    {college.location ||
                      college.city ||
                      "Location unavailable"}
                  </p>

                  <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                    {college.description ||
                      "Explore college information and student experiences."}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    
<button
  type="button"
  onClick={() => onOpenCollege(college)}
  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
>
  View College Details
  <ArrowRight size={17} />
</button>

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-indigo-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <GraduationCap
            size={42}
            className="mx-auto text-sky-300"
          />

          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to find your college?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-indigo-200">
            Explore your options, learn from student reviews,
            and take the next step toward your future.
          </p>

          <a
            href="#colleges"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-indigo-900 transition hover:bg-sky-100"
          >
            Browse Colleges
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
