import axios from "axios";

export const loginUserAction = async (payload) => {
  const response = await axios.post(
    "http://localhost:5001/api/users/login",
    payload
  );

  return response;
};

export const signupUserAction = async (payload) => {
  const response = await axios.post(
    "http://localhost:5001/api/users/register",
    payload
  );

  return response;
};

export const getUsersAction = async () => {
  const response = await axios.get(`http://localhost:5001/api/users/userList`);

  return response;
};
