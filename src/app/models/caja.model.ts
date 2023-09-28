//caja.model.ts
export interface Caja {
  caja_id: number;
  descripcion: string;
  moneda_id: number;
  estado: boolean;
}

export interface CajaVista {
  caja_id: number;
  descripcion: string;
  moneda_id: number;
  descripcion_moneda: string;
  estado: boolean;
}

