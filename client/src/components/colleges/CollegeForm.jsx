
import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  location: "",
  description: "",
};

function CollegeForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(
      initialData
        ? {
            name: initialData.name || "",
            location: initialData.location || "",
            description: initialData.description || "",
          }
        : { ...emptyForm }
    );

    setError("");
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter the college name.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Please enter the college location.");
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save the college. Please try again."
      );
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100";

  const labelClasses =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* College Name */}
      <div>
        <label htmlFor="college-name" className={labelClasses}>
          College Name <span className="text-red-500">*</span>
        </label>

        <input
          id="college-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter college name"
          maxLength={150}
          required
          disabled={loading}
          className={inputClasses}
        />

        <p className="mt-2 text-xs text-slate-400">
          Enter the official name of the college.
        </p>
      </div>

      {/* College Location */}
      <div>
        <label htmlFor="college-location" className={labelClasses}>
          Location <span className="text-red-500">*</span>
        </label>

        <input
          id="college-location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Chennai, Tamil Nadu"
          maxLength={200}
          required
          disabled={loading}
          className={inputClasses}
        />

        <p className="mt-2 text-xs text-slate-400">
          Specify the city, state, or campus location.
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="college-description"
          className={labelClasses}
        >
          College Description
          <span className="ml-2 font-normal text-slate-400">
            (Optional)
          </span>
        </label>

        <textarea
          id="college-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the college, its facilities, courses, and campus..."
          rows={5}
          maxLength={2000}
          disabled={loading}
          className={`${inputClasses} resize-y`}
        />

        <p className="mt-2 text-right text-xs text-slate-400">
          {formData.description.length}/2000 characters
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span className="font-bold">!</span>
          <p>{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          {loading
            ? "Saving..."
            : initialData
              ? "Update College"
              : "Create College"}
        </button>
      </div>
    </form>
  );
}

export default CollegeForm;