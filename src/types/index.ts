export interface Task {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_limite: string;
  usuarioId: number;
}
