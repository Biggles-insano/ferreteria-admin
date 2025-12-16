import api from './api';

export interface Product {
    id: number;
    codigo_producto: string;
    nombre: string;
    precio_base: number;
    stock_minimo: number;
    is_activo: boolean;
    marca?: { nombre: string };
    categoria?: { nombre: string };
    unidad?: { simbolo: string };
}

export interface CreateProductDTO {
    codigo_producto: string;
    nombre: string;
    marca_id: number;
    categoria_id: number;
    unidad_id: number;
    impuesto_id: number;
    precio_base: number;
    stock_minimo: number;
    descripcion?: string;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/productos');
    return response.data;
};

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
    const response = await api.post<Product>('/productos', data);
    return response.data;
};

export const updateProduct = async (id: number, data: Partial<CreateProductDTO>): Promise<Product> => {
    const response = await api.put<Product>(`/productos/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
};
