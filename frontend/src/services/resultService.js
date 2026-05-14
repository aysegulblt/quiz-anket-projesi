import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/results`;

export const saveQuizResult = async (resultData, token) => {
  const response = await axios.post(API_URL, resultData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyResults = async (token) => {
  const response = await axios.get(`${API_URL}/my-results`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};