import api from './api';

export const salesService = {
  // Crear una venta
  createSale: (detalles, observaciones = '') => {
    return api.post('/ventas/', {
      detalles,
      observaciones,
    });
  },

  // Obtener mis compras
  getMyPurchases: () => {
    return api.get('/ventas/cliente/mis_compras/');
  },

  // Obtener detalle de una venta específica
  getSaleDetail: (id) => {
    return api.get(`/ventas/${id}/`);
  },

  // Cancelar una venta
  cancelSale: (id) => {
    return api.delete(`/ventas/${id}/`);
  },
};
