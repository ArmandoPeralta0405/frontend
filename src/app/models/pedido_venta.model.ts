//pedido_venta_model.model.ts
export interface PedidoVenta {
  pedido_venta_id?: number;
  fecha_hora?: Date;
  moneda_id: number;
  lista_precio_id: number;
  numero_pedido: number;
  observacion: string;
  usuario_id: number;
  estado?: number;
}
