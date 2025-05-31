import axios from "axios";

export const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getRecruiterDashboard = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/api/recruiter/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const importSubmissions = async (submissions) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/api/recruiter/import`,
    { submissions },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
