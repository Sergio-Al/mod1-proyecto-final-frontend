import { useState, useEffect } from 'react';
import { Task } from '../types';
import { useAuth } from '../../../shared/context/AuthContext';

interface CreateTaskProps {
  task: Task | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (task: Task) => Promise<any>;
  onCancel: () => void;
}

export const CreateTask = ({ task, onSubmit, onCancel }: CreateTaskProps) => {
  const { userId } = useAuth();
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [fecha_limite, setFechaLimite] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  console.log(userId)

  // Set form values when editing an existing task
  useEffect(() => {
    if (task) {
      setTitulo(task.titulo || "");
      setDescripcion(task.descripcion || "");
      setEstado(task.estado || "");
      setFechaLimite(task.fecha_limite || "");
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [task]);

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setEstado("");
    setFechaLimite("");
    setErrorMessage("");
  };

//   o Solo se puede marcar como "en progreso" si está en "pendiente".
// o No se puede volver a "pendiente" desde "en progreso" o "completada".
// o Una vez "completada", no se puede modificar (solo eliminar).
  const onEstadoChange = (value: string) => {
    setErrorMessage("");
    let prevValue = ''
    if (isEditing) {
      prevValue = task?.estado || ''
    }
    if(prevValue === 'En Progreso' && value === 'Pendiente') {
      setErrorMessage("No puedes volver a Pendiente una tarea en progreso");
      return;
    }
    if(prevValue === 'Completada' && value !== 'Completada') {
      setErrorMessage("No puedes modificar una tarea completada");
      return;
    }
    if (prevValue === 'Pendiente' && value === 'En Progreso') {
      setErrorMessage("No puedes marcar una tarea como en progreso");
      return;
    }
    setEstado(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!titulo.trim()) {
      setErrorMessage("El título es requerido");
      return;
    }
    
    try {
      const taskData: Task = {
        ...(task?.id ? { id: task.id } : {}),
        titulo,
        descripcion,
        estado,
        fecha_limite,
        usuarioId: task?.usuarioId || userId || 0
      };
      
      await onSubmit(taskData);
      resetForm();
      onCancel(); // Close the modal
    } catch (err) {
      console.error("Failed to save task:", err);
      setErrorMessage("Error al guardar la tarea");
    }
  };

  return (
    <div className="modal-box" style={{ maxWidth: "400px" }}>
      <h3 className="font-bold text-lg">
        {isEditing ? "Editar tarea" : "Crear tarea"}
      </h3>
      <div className="modal-action">
        <form method="dialog" className="w-full" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
          <fieldset className="fieldset w-xs mx-auto bg-base-200 border border-base-300 p-4 rounded-box">
            <label className="fieldset-label">Titulo</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input"
              placeholder="Titulo"
            />

            <label className="fieldset-label">Estado</label>
            <select 
              value={estado}
              onChange={(e) => onEstadoChange(e.target.value)}
              className="select w-full"
            >
              <option value="" disabled>Seleccione un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>

            <label className="fieldset-label">Descripcion</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="textarea"
              placeholder="Descripcion"
              rows={3}
            />

            <label className="fieldset-label">Fecha Limite</label>
            <input
              type="date"
              value={fecha_limite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="input"
            />
            <button type="submit" className="btn btn-primary mt-4 mr-2">
              {isEditing ? "Guardar" : "Crear"}
            </button>
            <button
              type="button"
              className="btn btn-neutral mt-4"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
