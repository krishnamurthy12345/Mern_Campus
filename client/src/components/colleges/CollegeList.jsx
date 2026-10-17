
function CollegeList({
  colleges = [],
  onEdit,
  onDelete,
  deletingId,
}) {
  if (colleges.length === 0) {
    return (
      <div className="empty-state">
        <h3>No colleges found</h3>
        <p>Add your first college to get started.</p>
      </div>
    );
  }

  return (
    <div className="college-list">
      {colleges.map((college) => (
        <article className="college-card" key={college._id}>
          <div className="college-card-content">
            <h3>{college.name}</h3>

            <p className="college-location">
              📍 {college.location}
            </p>

            <p>
              {college.description || "No description available."}
            </p>
          </div>

          <div className="college-card-actions">
            <button
              type="button"
              onClick={() => onEdit(college)}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(college._id)}
              disabled={deletingId === college._id}
            >
              {deletingId === college._id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default CollegeList;
