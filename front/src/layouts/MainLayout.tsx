import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    LogOut,
    ShoppingCart,
    Package,
    Users
} from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-blue-600">Ferretería</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {/* Dashboard: Visible to Admin, Cajero & Inventario */}
                    {(user?.roles.includes('Admin') || user?.roles.includes('Cajero') || user?.roles.includes('Inventario')) && (
                        <Link to="/" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                    )}

                    {/* POS: Visible to Admin & Cajero */}
                    {(user?.roles.includes('Admin') || user?.roles.includes('Cajero')) && (
                        <Link to="/pos" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                            <ShoppingCart size={20} />
                            <span>Punto de Venta</span>
                        </Link>
                    )}

                    {/* Ventas: Admin only */}
                    {user?.roles.includes('Admin') && (
                        <Link to="/ventas" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                            <ShoppingCart size={20} />
                            <span>Ventas</span>
                        </Link>
                    )}

                    {/* Inventario: Admin, Cajero (Read), Inventario (Edit) */}
                    {(user?.roles.includes('Admin') || user?.roles.includes('Cajero') || user?.roles.includes('Inventario')) && (
                        <Link to="/inventario" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                            <Package size={20} />
                            <span>Inventario</span>
                        </Link>
                    )}

                    {/* Usuarios: Admin only */}
                    {user?.roles.includes('Admin') && (
                        <Link to="/usuarios" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                            <Users size={20} />
                            <span>Usuarios</span>
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user?.nombre?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
