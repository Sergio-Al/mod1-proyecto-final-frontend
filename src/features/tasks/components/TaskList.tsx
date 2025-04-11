import { Task, TaskStatus } from "../types";
import { CiEdit } from "react-icons/ci";
import { CiCircleRemove } from "react-icons/ci";
import React, { useEffect, useState } from "react";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (taskId?: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onSelectTask,
  onDeleteTask,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="alert shadow-lg bg-base-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold">No hay tareas disponibles.</h3>
          <div className="text-xs">Crea una nueva tarea para comenzar.</div>
        </div>
      </div>
    );
  }

  // Tarjeta para pantallas pequeñas
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4 mt-4">
        {tasks.map((task: Task) => (
          <div key={task.id} className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <h3 className="card-title text-base">{task.titulo}</h3>
                <div
                  className={`badge ${getStatusBadgeClass(task.estado)} gap-1`}
                >
                  {getStatusIcon(task.estado)}
                  {task.estado}
                </div>
              </div>

              <div className="text-sm mt-2 line-clamp-2">
                {task.descripcion || (
                  <span className="text-opacity-60">Sin descripción</span>
                )}
              </div>

              <div className="flex items-center mt-2 text-xs text-opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatDate(task.fecha_limite) || "Sin fecha"}</span>
              </div>

              <div className="card-actions justify-end mt-3">
                {task.estado !== TaskStatus.COMPLETED && (
                  <button
                    className="btn btn-outline btn-xs"
                    onClick={() => onSelectTask(task)}
                  >
                    <CiEdit /> Editar
                  </button>
                )}
                {task.estado === TaskStatus.COMPLETED && (
                  <button
                    className="btn btn-outline btn-xs text-red-400"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <CiCircleRemove className="text-lg" /> Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Tabla para pantallas grandes
  return (
    <div className="mt-4 overflow-x-auto rounded-box bg-base-100">
      <table className="table table-zebra">
        <thead>
          <tr className="bg-base-200">
            <th>Título</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Fecha Límite</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: Task) => (
            <tr key={task.id} className="hover cursor-pointer">
              <td className="font-medium">{task.titulo}</td>
              <td>
                <div
                  className={`badge ${getStatusBadgeClass(task.estado)} gap-1`}
                >
                  {getStatusIcon(task.estado)}
                  {task.estado}
                </div>
              </td>
              <td className="max-w-xs truncate">{task.descripcion}</td>
              <td>{formatDate(task.fecha_limite)}</td>
              <td>
                {task.estado !== TaskStatus.COMPLETED && (
                  <div className="tooltip tooltip-top" data-tip="Editar tarea">
                    <button
                      className="btn btn-outline btn-sm mr-2"
                      onClick={() => onSelectTask(task)}
                    >
                      <CiEdit />
                    </button>
                  </div>
                )}

                {task.estado === TaskStatus.COMPLETED && (
                  <div
                    className="tooltip tooltip-top"
                    data-tip="Eliminar tarea"
                  >
                    <button
                      className="btn btn-outline text-red-400 btn-sm"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <CiCircleRemove className="text-lg" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Funcion auxiliar para formatear la fecha
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case TaskStatus.COMPLETED.toLowerCase():
      return "badge-success text-success-content";
    case TaskStatus.IN_PROGRESS.toLowerCase():
      return "badge-info text-info-content";
    case TaskStatus.PENDING.toLowerCase():
      return "badge-warning text-warning-content";
    default:
      return "badge-neutral text-neutral-content";
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status.toLowerCase()) {
    case TaskStatus.COMPLETED.toLowerCase():
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-4 h-4 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      );
    case TaskStatus.IN_PROGRESS.toLowerCase():
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-4 h-4 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      );
    case TaskStatus.PENDING.toLowerCase():
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-4 h-4 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      );
    default:
      return <></>;
  }
};
