import axios from "axios";

const API_URL = "http://localhost:5000/api/quizzes";

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
export const deleteQuiz = async (quizId, token) => {
  const response = await axios.delete(`${API_URL}/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};