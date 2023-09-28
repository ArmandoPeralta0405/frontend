//pedido_venta_detalle_model.model.ts
export interface PedidoVentaDetalle {
  pedido_venta_id?: number;
  item_numero: number;
  articulo_id: number;
  cantidad: number;
  precio: number;
  monto_neto?: number;
  monto_iva?: number;
  porcentaje_iva?: number;
  referencia: string;
}
