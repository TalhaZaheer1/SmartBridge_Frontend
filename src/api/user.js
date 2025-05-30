import API from "./dashboard";

// GET all users
export const getAllUsers = async () => {
  const { data } = await API.get("/users");
  return data;
};

// GET a single user
export const getUserById = async (id) => {
  const { data } = await API.get(`/users/${id}`);
  return data;
};

// CREATE user
export const createUser = async (userData) => {
  const { data } = await API.post("/users", userData);
  return data;
};

// UPDATE user
export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/users/${id}`, userData);
  return data;
};

// DELETE user
export const deleteUser = async (id) => {
  const { data } = await API.delete(`/users/${id}`);
  return data;
};

// ADJUST balance
export const adjustBalance = async (userId, payload) => {
  const { data } = await API.post(`/users/${userId}/adjust-balance`, payload);
  return data;
};
export const updatestatus = async (userId, payload) => {
  const { data } = await API.put(`/users/${userId}/status`, payload); // use PUT and include payload
  return data;
};

