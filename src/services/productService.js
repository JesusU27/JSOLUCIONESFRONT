import api from './api';

export const productService = {
  // Obtener todos los productos sin paginación
  getAllProducts: () => {
    return api.get('/productos/');
  },

  // Obtener productos con paginación
  getProductsPaginated: (page = 1, pageSize = 10) => {
    return api.get(`/productos/?page=${page}&page_size=${pageSize}`);
  },

  // Obtener un producto específico por ID
  getProductById: (id) => {
    return api.get(`/productos/${id}/`);
  },

  // Crear un producto (requiere permisos de admin)
  createProduct: (productData) => {
    return api.post('/productos/', productData);
  },

  // Actualizar un producto (requiere permisos de admin)
  updateProduct: (id, productData) => {
    return api.put(`/productos/${id}/`, productData);
  },

  // Eliminar un producto (requiere permisos de admin)
  deleteProduct: (id) => {
    return api.delete(`/productos/${id}/`);
  },
};
