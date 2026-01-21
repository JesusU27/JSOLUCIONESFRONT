import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import './ProductList.css';

const ProductList = forwardRef(({ onAddToCart }, ref) => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [mode, setMode] = useState('all'); // 'all' o 'paginated'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Exponer métodos de recarga
  useImperativeHandle(ref, () => ({
    reloadProducts: () => {
      if (mode === 'all') {
        fetchAllProducts();
      } else {
        fetchPaginatedProducts(1);
      }
    },
  }));

  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getAllProducts();
      setProductos(data.results);
      setPaginationInfo(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaginatedProducts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProductsPaginated(page, pageSize);
      setProductos(data.results);
      setPaginationInfo({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: page,
      });
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching paginated products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'all') {
      fetchAllProducts();
    } else {
      fetchPaginatedProducts(1);
    }
  }, [mode, pageSize]);

  const handleNextPage = () => {
    if (paginationInfo?.next) {
      fetchPaginatedProducts(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationInfo?.previous && currentPage > 1) {
      fetchPaginatedProducts(currentPage - 1);
    }
  };

  return (
    <div className="product-list-container">
      <h2>Catálogo de Productos</h2>

      {/* Controles */}
      <div className="product-controls">
        <div className="mode-selector">
          <label>Modo de visualización:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="all">Ver Todo</option>
            <option value="paginated">Paginado</option>
          </select>
        </div>

        {mode === 'paginated' && (
          <div className="pagination-settings">
            <label>Productos por página:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
            />
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Cargando productos...</div>}

      {/* Grid de productos */}
      {!loading && productos.length > 0 && (
        <div className="products-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="product-card">
              <div className="product-image">
                <img src={producto.imagen_url} alt={producto.nombre} />
              </div>
              <div className="product-info">
                <h3>{producto.nombre}</h3>
                <p className="product-codigo">{producto.codigo}</p>
                <p className="product-descripcion">{producto.descripcion}</p>
                <div className="product-footer">
                  <div className="product-price">${parseFloat(producto.precio).toFixed(2)}</div>
                  <div className="product-stock">
                    Stock: <span className={producto.stock > 0 ? 'in-stock' : 'out-stock'}>
                      {producto.stock}
                    </span>
                  </div>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => {
                    addToCart(producto);
                    onAddToCart?.();
                  }}
                  disabled={producto.stock === 0}
                >
                  {producto.stock === 0 ? 'Agotado' : '🛒 Agregar al Carrito'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && productos.length === 0 && (
        <div className="no-products">No hay productos disponibles</div>
      )}

      {/* Controles de paginación */}
      {mode === 'paginated' && paginationInfo && (
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

      {mode === 'all' && productos.length > 0 && (
        <div className="total-info">Total: {productos.length} productos</div>
      )}
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;
