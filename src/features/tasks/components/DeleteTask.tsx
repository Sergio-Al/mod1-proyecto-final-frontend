import { Task } from "../types";

interface DeleteTaskProps {
  selectedTask: Task | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: (taskId: number) => Promise<any>;
  onCancel: () => void;
}

const DeleteTask = ({ selectedTask, onDelete, onCancel }: DeleteTaskProps) => {
  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg">Eliminar Tarea</h3>
      <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
      <div className="modal-action">
        {selectedTask && selectedTask.id ? (
          <button
            className="btn btn-error text-shadow-indigo-50"
            onClick={() => onDelete(selectedTask.id!)}
          >
            Eliminar
          </button>
        ) : (
          <> </>
        )}
        <button className="btn" onClick={() => onCancel()}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteTask;
