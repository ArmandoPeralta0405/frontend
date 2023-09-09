// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'http://192.168.100.7:3000/api', // Cambia a tu dirección IP local y puerto
  tiempoAnimacion: '350ms'
};

export const environmentLocal = {
  production: true,
  apiUrl: 'http://localhost:3000/api', // Cambia a tu dirección IP local y puerto
  tiempoAnimacion: '350ms'
};
