// articulo_lista_precio.model.ts
export interface ArticuloListaPrecio {
  articulo_id: number;
  lista_precio_id: number;
  precio: number;
}

export interface ArticuloListaPrecioVista {
  articulo_id: number;
  descripcion_articulo: string;
  lista_precio_id: number;
  descripcion_lista_precio: string;
  moneda_id: number;
  descripcion_moneda: string;
  precio: number;
}
