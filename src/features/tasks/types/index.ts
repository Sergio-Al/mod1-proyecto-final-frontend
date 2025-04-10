export enum TaskStatus {
  COMPLETED = "Completada",
  IN_PROGRESS = "En Progreso",
  PENDING = "Pendiente"
}

export interface Task {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: TaskStatus | string;
  fecha_limite: string;
  usuarioId: number;
}
