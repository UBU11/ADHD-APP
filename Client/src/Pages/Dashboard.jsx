import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/assignments");
        setAssignments(response.data);
      } catch (err) {
        setError("Failed to fetch assignments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading)
    return <p className="text-center mt-8">Loading assignments...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Assignments
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {assignments.length > 0 ? (
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.id} className="border-b last:border-b-0 py-3">
                <h2 className="text-xl font-semibold text-gray-700">
                  {assignment.title}
                </h2>
                <p className="text-gray-500">Due: {assignment.dueDate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assignments found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
