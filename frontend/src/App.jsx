import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import CreateQuiz from "./pages/CreateQuiz";
import QuizDetail from "./pages/QuizDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import MyQuizzes from "./pages/MyQuizzes";
import EditQuiz from "./pages/EditQuiz";
import MyResults from "./pages/MyResults";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-quizzes"
            element={
              <ProtectedRoute>
                <MyQuizzes />
              </ProtectedRoute>
            }
          />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route
            path="/edit-quiz/:id"
            element={
              <ProtectedRoute>
                <EditQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-results"
            element={
              <ProtectedRoute>
                <MyResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
