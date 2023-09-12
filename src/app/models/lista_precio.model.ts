// lista_precio.model.ts
export interface ListaPrecio {
  lista_precio_id: number;
  descripcion: string;
  moneda_id: number;
}

export interface ListaPrecioVista {
  lista_precio_id: number;
  descripcion: string;
  moneda_id: number;
  moneda_descripcion: string;
}

