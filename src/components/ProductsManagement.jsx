import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    activo: true,
    imagen_url: '',
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchProducts(1);
  }, [pageSize]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProductsPaginated(page, pageSize);
      setProducts(data.results);
      setPaginationInfo({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: page,
      });
      setCurrentPage(page);
      setEditingId(null);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.codigo.trim() || !formData.nombre.trim() || !formData.precio) {
      setError('Código, nombre y precio son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await productService.createProduct({
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
      });
      setSuccess('Producto creado correctamente');
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        activo: true,
        imagen_url: '',
      });
      setShowCreateForm(false);
      fetchProducts(1);
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (product) => {
    setEditingId(product.id);
    setFormData({
      codigo: product.codigo,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      categoria: product.categoria,
      activo: product.activo,
      imagen_url: product.imagen_url || '',
    });
    setOriginalData({
      codigo: product.codigo,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      categoria: product.categoria,
      activo: product.activo,
      imagen_url: product.imagen_url || '',
    });
    setShowCreateForm(false);
  };

  const handleEditSave = async () => {
    setError('');
    setSuccess('');

    if (!formData.codigo.trim() || !formData.nombre.trim() || !formData.precio) {
      setError('Código, nombre y precio son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await productService.updateProduct(editingId, {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
      });
      setSuccess('Producto actualizado correctamente');
      setEditingId(null);
      fetchProducts(currentPage);
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setFormData({ ...originalData });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      setSuccess('Producto eliminado correctamente');
      fetchProducts(currentPage);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (paginationInfo?.next) {
      fetchProducts(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationInfo?.previous && currentPage > 1) {
      fetchProducts(currentPage - 1);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-management-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="products-management-container">
      <h2>📦 Gestión de Productos</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Controles */}
      <div className="products-controls">
        <button
          className="create-btn"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingId(null);
            if (!showCreateForm) {
              setFormData({
                codigo: '',
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria: '',
                activo: true,
                imagen_url: '',
              });
            }
          }}
        >
          {showCreateForm ? '✕ Cancelar' : '➕ Crear Producto'}
        </button>

        <div className="page-size-selector">
          <label>Productos por página:</label>
          <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Formulario de Creación */}
      {showCreateForm && (
        <div className="product-form-card">
          <h3>Crear Nuevo Producto</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ej: PROD-001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  name="precio"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  placeholder="Categoría"
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                  />
                  Producto Activo
                </label>
              </div>

              <div className="form-group full">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                  rows="3"
                />
              </div>

              <div className="form-group full">
                <label>URL Imagen</label>
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creando...' : '✓ Crear Producto'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCreateForm(false)}
                disabled={loading}
              >
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Productos */}
      {products.length > 0 ? (
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                <div className="product-main-info">
                  <div className="product-code">{product.codigo}</div>
                  <div className="product-name">{product.nombre}</div>
                  <div className="product-price">${parseFloat(product.precio).toFixed(2)}</div>
                </div>

                <div className="product-stats">
                  <div className="stat">
                    <span className="stat-label">Stock:</span>
                    <span className="stat-value">{product.stock}</span>
                  </div>
                  <div className={`status-badge ${product.activo ? 'active' : 'inactive'}`}>
                    {product.activo ? '✓ Activo' : '✕ Inactivo'}
                  </div>
                </div>

                <div className="expand-icon">{expandedId === product.id ? '▼' : '▶'}</div>
              </div>

              {expandedId === product.id && (
                <div className="product-details">
                  {editingId === product.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Código</label>
                          <input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Nombre</label>
                          <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Precio</label>
                          <input
                            type="number"
                            name="precio"
                            step="0.01"
                            value={formData.precio}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Stock</label>
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group">
                          <label>Categoría</label>
                          <input
                            type="text"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group checkbox">
                          <label>
                            <input
                              type="checkbox"
                              name="activo"
                              checked={formData.activo}
                              onChange={handleChange}
                            />
                            Producto Activo
                          </label>
                        </div>

                        <div className="form-group full">
                          <label>Descripción</label>
                          <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="2"
                          />
                        </div>

                        <div className="form-group full">
                          <label>URL Imagen</label>
                          <input
                            type="url"
                            name="imagen_url"
                            value={formData.imagen_url}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-buttons">
                        <button type="submit" className="submit-btn" disabled={loading}>
                          {loading ? 'Guardando...' : '✓ Guardar Cambios'}
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={handleEditCancel}
                          disabled={loading}
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="details-info">
                        <div className="info-item">
                          <span className="info-label">Código:</span>
                          <span className="info-value">{product.codigo}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Nombre:</span>
                          <span className="info-value">{product.nombre}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Precio:</span>
                          <span className="info-value">${parseFloat(product.precio).toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Stock:</span>
                          <span className="info-value">{product.stock}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Categoría:</span>
                          <span className="info-value">{product.categoria || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Estado:</span>
                          <span className="info-value">{product.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                      </div>

                      {product.descripcion && (
                        <div className="description-section">
                          <h4>Descripción</h4>
                          <p>{product.descripcion}</p>
                        </div>
                      )}

                      {product.imagen_url && (
                        <div className="image-section">
                          <h4>Imagen</h4>
                          <img src={product.imagen_url} alt={product.nombre} className="product-image" />
                        </div>
                      )}

                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditStart(product)}
                          disabled={loading}
                        >
                          ✎ Editar
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product.id)}
                          disabled={loading}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">No hay productos para mostrar</div>
      )}

      {/* Paginación */}
      {paginationInfo && (
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={!paginationInfo.previous}
            className="pagination-btn"
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {paginationInfo.currentPage} de{' '}
            {Math.ceil(paginationInfo.count / pageSize)}
            {' '}({paginationInfo.count} productos totales)
          </span>
          <button
            onClick={handleNextPage}
            disabled={!paginationInfo.next}
            className="pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
