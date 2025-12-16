import { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct, type Product, type CreateProductDTO } from '../services/productService';
import { getBrands, getCategories, getUnits, type CatalogItem } from '../services/catalogService';
import { Plus, Trash2, X } from 'lucide-react';

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<CatalogItem[]>([]);
    const [categories, setCategories] = useState<CatalogItem[]>([]);
    const [units, setUnits] = useState<CatalogItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState<CreateProductDTO>({
        codigo_producto: '',
        nombre: '',
        marca_id: 0,
        categoria_id: 0,
        unidad_id: 0,
        impuesto_id: 1, // Defaulting to 1 for now if we don't fetch taxes
        precio_base: 0,
        stock_minimo: 5,
        descripcion: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prods, brs, cats, uns] = await Promise.all([
                getProducts(),
                getBrands(),
                getCategories(),
                getUnits()
            ]);
            setProducts(prods);
            setBrands(brs);
            setCategories(cats);
            setUnits(uns);
        } catch (error) {
            console.error('Error loading inventory data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProduct(formData);
            fetchData();
            setIsModalOpen(false);
            // Reset form (simplified)
        } catch (error) {
            alert('Error creating product');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete product?')) {
            await deleteProduct(id);
            fetchData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Inventario</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? <tr><td colSpan={5} className="text-center py-4">Cargando...</td></tr> :
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.codigo_producto}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoria?.nombre || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">Q{Number(product.precio_base).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Simplified */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-bold">Nuevo Producto</h2>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Código" required className="border p-2 rounded"
                                    onChange={e => setFormData({ ...formData, codigo_producto: e.target.value })} />
                                <input placeholder="Nombre" required className="border p-2 rounded"
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="border p-2 rounded" onChange={e => setFormData({ ...formData, marca_id: Number(e.target.value) })}>
                                    <option value="">Marca</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                                </select>
                                <select className="border p-2 rounded" onChange={e => setFormData({ ...formData, categoria_id: Number(e.target.value) })}>
                                    <option value="">Categoría</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="border p-2 rounded" onChange={e => setFormData({ ...formData, unidad_id: Number(e.target.value) })}>
                                    <option value="">Unidad</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                                </select>
                                <input type="number" placeholder="Precio Base" className="border p-2 rounded"
                                    onChange={e => setFormData({ ...formData, precio_base: Number(e.target.value) })} />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Guardar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
