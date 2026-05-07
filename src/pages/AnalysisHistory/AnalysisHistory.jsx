import React from "react";
import "./AnalysisHistory.css";

const analyses = [
  {
    id: 1,
    image: "leaf_001.jpg",
    disease: "Powdery Mildew",
    confidence: "96%",
    date: "2026-05-07",
    status: "Completed",
  },
  {
    id: 2,
    image: "tomato_leaf.png",
    disease: "Bacterial Spot",
    confidence: "89%",
    date: "2026-05-06",
    status: "Completed",
  },
  {
    id: 3,
    image: "corn_leaf.jpg",
    disease: "Healthy",
    confidence: "99%",
    date: "2026-05-05",
    status: "Pending",
  },
];

export default function AnalysisHistory() {
  return (
    <div className="analysis-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analysis History</h1>

          <p className="page-subtitle">
            View all previous plant disease analyses
          </p>
        </div>

        <button className="btn btn--primary">
          Export History
        </button>
      </div>

      {/* Filters */}
      <div className="dis-filters">

        <div className="dis-search">
          <input
            type="text"
            placeholder="Search analyses..."
            className="dis-search-input"
          />
        </div>

        <select className="dis-select">
          <option>All Results</option>
          <option>Healthy</option>
          <option>Diseased</option>
          <option>Pending</option>
        </select>

      </div>

      {/* Table */}
      <div className="dis-card">

        <div className="dis-table-wrap">

          <table className="dis-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Disease</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {analyses.map((analysis) => (
                <tr key={analysis.id}>

                  <td>{analysis.id}</td>

                  <td className="dis-name">
                    {analysis.image}
                  </td>

                  <td>{analysis.disease}</td>

                  <td>{analysis.confidence}</td>

                  <td>{analysis.date}</td>

                  <td>
                    <span
                      className={`dis-badge ${
                        analysis.status === "Completed"
                          ? "badge--low"
                          : "badge--medium"
                      }`}
                    >
                      {analysis.status}
                    </span>
                  </td>

                  <td>
                    <div className="dis-actions">

                      <button className="dis-action-btn dis-action-btn--edit">
                        View
                      </button>

                      <button className="dis-action-btn dis-action-btn--delete">
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}