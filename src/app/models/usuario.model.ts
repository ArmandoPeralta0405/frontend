// usuario.model.ts
export interface Usuario {
  usuario_id: number;
  alias: string;
  nombre: string;
  apellido: string;
  email: string;
  cedula_identidad: string;
  estado: boolean;
}
