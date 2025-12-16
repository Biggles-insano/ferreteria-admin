import api from './api';

export interface CatalogItem {
    id: number;
    nombre: string;
    simbolo?: string; // For units
}

export const getBrands = async (): Promise<CatalogItem[]> => {
    const response = await api.get<CatalogItem[]>('/catalogos/marcas');
    return response.data;
};

export const getCategories = async (): Promise<CatalogItem[]> => {
    const response = await api.get<CatalogItem[]>('/catalogos/categorias');
    return response.data;
};

export const getUnits = async (): Promise<CatalogItem[]> => {
    const response = await api.get<CatalogItem[]>('/catalogos/unidades');
    return response.data;
};
