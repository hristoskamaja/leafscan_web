import React from "react";
import "./Users.css";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Researcher",
    status: "Inactive",
  },
];

export default function Users() {
  return (
    <div className="users-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            Manage system users and permissions
          </p>
        </div>

        <button className="btn btn--primary">
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="dis-card">
        <div className="dis-table-wrap">

          <table className="dis-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td className="dis-name">
                    {user.name}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>
                    {user.role}
                  </td>

                  <td>
                    <span
                      className={`dis-badge ${
                        user.status === "Active"
                          ? "badge--low"
                          : "badge--high"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div className="dis-actions">

                      <button className="dis-action-btn dis-action-btn--edit">
                        Edit
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