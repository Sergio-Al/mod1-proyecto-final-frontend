import { Navigate } from "react-router-dom";
import React from "react";
import { MainLayout } from "../shared/layouts/MainLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  title?: string;
}

function ProtectedRoute({
  children,
  title = "Gestor de Tareas",
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout title={title}>{children}</MainLayout>;
}

export default ProtectedRoute;
