
import { useCallback, useEffect, useState } from "react";

import CollegeForm from "../components/colleges/CollegeForm";
import CollegeList from "../components/colleges/CollegeList";

import {
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../services/collegeService";

function AdminDashboard() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const loadColleges = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getColleges();

      const list = Array.isArray(response)
        ? response
        : response?.colleges ??
          response?.data?.colleges ??
          response?.data ??
          [];

      if (!Array.isArray(list)) {
        throw new Error("Invalid colleges response from server.");
      }

      setColleges(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load colleges."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  const handleSaveCollege = async (collegeData) => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (selectedCollege) {
        await updateCollege(selectedCollege._id, collegeData);
        setMessage("College updated successfully.");
      } else {
        await createCollege(collegeData);
        setMessage("College created successfully.");
      }

      setSelectedCollege(null);
      setShowForm(false);
      await loadColleges();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save college."
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (college) => {
    setSelectedCollege(college);
    setShowForm(true);
    setError("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setSelectedCollege(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleCancel = () => {
    setSelectedCollege(null);
    setShowForm(false);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this college?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setMessage("");

    try {
      await deleteCollege(id);

      setColleges((previous) =>
        previous.filter((college) => college._id !== id)
      );

      if (selectedCollege?._id === id) {
        setSelectedCollege(null);
        setShowForm(false);
      }

      setMessage("College deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete college."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredColleges = colleges.filter((college) => {
    const query = search.toLowerCase().trim();

    return (
      college.name?.toLowerCase().includes(query) ||
      college.location?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              College Review System
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage colleges and maintain your college directory.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="text-lg">+</span>
            Add New College
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Feedback Messages */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="font-bold"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Colleges
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "—" : colleges.length}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Colleges in the directory
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🏫
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Search Results
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "—" : filteredColleges.length}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Colleges matching your search
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                🔎
              </div>
            </div>
          </div>
        </section>

        {/* Add/Edit Form */}
        {showForm && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedCollege
                    ? "Edit College"
                    : "Add New College"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCollege
                    ? "Update the college information below."
                    : "Enter the details to add a college to the directory."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <CollegeForm
              key={selectedCollege?._id || "new-college"}
              initialData={selectedCollege}
              onSubmit={handleSaveCollege}
              onCancel={handleCancel}
              loading={saving}
            />
          </section>
        )}

        {/* College Directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Manage Colleges
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View, edit, or remove college records.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name or location..."
                  aria-label="Search colleges"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={loadColleges}
                disabled={loading}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {loading ? "Loading..." : "↻ Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">
                Loading colleges...
              </p>
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl">🏫</div>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                {search
                  ? "No matching colleges"
                  : "No colleges available"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Try another college name or location."
                  : "Add your first college to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add College
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">
                        College
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        Location
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        Description
                      </th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredColleges.map((college) => (
                      <tr
                        key={college._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-slate-900">
                            {college.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            ID: {college._id}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {college.location}
                        </td>

                        <td className="max-w-xs px-6 py-5 text-sm text-slate-500">
                          <p className="line-clamp-2">
                            {college.description ||
                              "No description provided"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(college)}
                              className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(college._id)
                              }
                              disabled={
                                deletingId === college._id
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === college._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid gap-4 p-4 md:hidden">
                {filteredColleges.map((college) => (
                  <article
                    key={college._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <h3 className="font-bold text-slate-900">
                      {college.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      📍 {college.location}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {college.description ||
                        "No description provided."}
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(college)}
                        className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(college._id)}
                        disabled={deletingId === college._id}
                        className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === college._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500 sm:px-6">
            Showing {filteredColleges.length} of {colleges.length} colleges
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
