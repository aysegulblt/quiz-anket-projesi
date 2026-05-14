import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/quizzes`;

export const getAllQuizzes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
export const createQuiz = async (quizData, token) => {
  const response = await axios.post(API_URL, quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyQuizzes = async (token) => {
  const response = await axios.get(`${API_URL}/my/quizzes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const deleteQuiz = async (quizId, token) => {
  const response = await axios.delete(`${API_URL}/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getQuizById = async (quizId) => {
  const response = await axios.get(`${API_URL}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quizId, quizData, token) => {
  const response = await axios.put(`${API_URL}/${quizId}`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
