
import { useState, useEffect } from 'react';
import { getProducts, type Product } from '../services/productService';
import { salesService } from '../services/salesService';
import { useAuth } from '../context/AuthContext';

interface CartItem extends Product {
    quantity: number;
}

const POS = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredProducts(products.filter(p =>
                p.nombre.toLowerCase().includes(lower) ||
                p.codigo_producto.toLowerCase().includes(lower)
            ));
        }
    }, [searchTerm, products]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Error loading products", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.precio_base * item.quantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        try {
            const pedidoData = {
                cliente_id: 1, // Placeholder for generic client
                vendedor_id: user?.id || 1, // Fallback if no user
                fecha_pedido: new Date(),
                monto_total: calculateTotal(),
                estado: 'COMPLETADO',
                detalles: cart.map(item => ({
                    producto_id: item.id,
                    cantidad: item.quantity,
                    precio_unitario: item.precio_base,
                    total: item.precio_base * item.quantity,
                    descuento: 0
                }))
            };

            await salesService.createPedido(pedidoData);
            alert('Venta realizada con éxito!');
            setCart([]);
        } catch (error) {
            console.error(error);
            alert('Error al procesar la venta');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            {/* Left: Product Catalog */}
            <div className="w-2/3 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Buscar producto por nombre o código..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {loading ? (
                        <div className="text-center py-10">Cargando productos...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between border border-transparent hover:border-blue-300"
                                >
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">{product.codigo_producto}</div>
                                        <h3 className="font-semibold text-gray-800 leading-tight mb-2">{product.nombre}</h3>
                                        <div className="text-xs text-gray-500 mb-2">{product.marca?.nombre}</div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-lg font-bold text-blue-600">Q{Number(product.precio_base).toFixed(2)}</span>
                                        <button className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Ticket de Venta</h2>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">{cart.length} items</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p>El carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.nombre}</p>
                                        <p className="text-sm text-gray-500">Q{Number(item.precio_base).toFixed(2)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                                            <span className="px-2">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                                        </div>
                                        <p className="font-bold text-gray-800 min-w-[60px] text-right">
                                            Q{(item.precio_base * item.quantity).toFixed(2)}
                                        </p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Total</span>
                        <span className="text-3xl font-bold text-gray-800">Q{calculateTotal().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-transform active:scale-95 ${cart.length === 0 || processing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                            }`}
                    >
                        {processing ? 'Procesando...' : 'COBRAR'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
