//timbrado.model.ts
export interface Timbrado {
  timbrado_id: number;
  numero: number;
  establecimiento: number;
  punto_emision: number;
  numero_inicial: number;
  numero_final: number;
  fecha_inicial?: String;
  fecha_final?: String;
  estado?: boolean;
  tipo_documento_id: number;
}

export interface TimbradoVista {
  timbrado_id: number;
  numero: String;
  establecimiento: String;
  punto_emision: String;
  numero_inicial: String;
  numero_final: String;
  fecha_inicial?: String;
  fecha_final?: String;
  estado: boolean;
  tipo_documento_id: number;
  descripcion_tipo_documento: String;
}
