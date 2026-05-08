import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import CreateQuiz from "./pages/CreateQuiz";
import QuizDetail from "./pages/QuizDetail";
import ProtectedRoute from "./components/ProtectedRoute";
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
        }/>
          <Route path="/quizzes/:id" element={<QuizDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;