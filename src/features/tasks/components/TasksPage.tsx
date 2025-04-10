import { useRef } from "react";
import { useTasks } from "../hooks/useTasks";
import { CreateTask } from "./CreateTask";
import { TaskList } from "./TaskList";
import { Task } from "../types";
import DeleteTask from "./DeleteTask";
import { CiCirclePlus } from "react-icons/ci";

export const TasksPage = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalDeleteRef = useRef<HTMLDialogElement>(null);
  const {
    tasks,
    selectedTask,
    loading,
    error,
    createTask,
    updateTask,
    selectTask,
    deleteTask,
  } = useTasks();

  const handleOpenModal = () => {
    modalRef.current?.showModal();
  };

  const handleOpenDeleteModal = () => {
    modalDeleteRef.current?.showModal();
  };

  const handleCloseModal = () => {
    modalRef.current?.close();
    selectTask(null);
  };

  const handleCloseDeleteModal = () => {
    modalDeleteRef.current?.close();
    selectTask(null);
  };

  const handleTaskSubmit = async (task: Task) => {
    if (selectedTask && selectedTask.id) {
      return await updateTask(task);
    } else {
      return await createTask(task);
    }
  };

  const handleTaskDelete = async (taskId?: number) => {
    if (taskId) {
      await deleteTask(taskId);
      modalDeleteRef.current?.close();
    }
  };

  const handleSelectTask = (task: Task) => {
    selectTask(task);
    handleOpenModal();
  };

  const handleDeleteSelectedTask = async (taskId?: number) => {
    if (taskId) {
      selectTask(tasks.find((task) => task.id === taskId) || null);
      handleOpenDeleteModal();
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Tareas</h2>
        <button onClick={handleOpenModal} className="btn btn-primary">
          <CiCirclePlus
            className="mr-2 text-2xl"
          />
          Crear Tarea
        </button>
      </div>

      <TaskList
        tasks={tasks}
        isLoading={loading}
        onSelectTask={handleSelectTask}
        onDeleteTask={handleDeleteSelectedTask}
      />

      <dialog ref={modalRef} className="modal">
        <CreateTask
          task={selectedTask}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseModal}
        />
      </dialog>

      <dialog ref={modalDeleteRef} className="modal">
        <DeleteTask
          selectedTask={selectedTask}
          onDelete={handleTaskDelete}
          onCancel={handleCloseDeleteModal}
        />
      </dialog>
    </div>
  );
};
