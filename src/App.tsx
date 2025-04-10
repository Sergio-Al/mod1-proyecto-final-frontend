import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider } from "./shared/context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { TasksPage } from "./features/tasks/components/TasksPage";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.classList.add("centered-body");
    } else {
      document.body.classList.remove("centered-body");
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute title="Gestor de Tareas">
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
