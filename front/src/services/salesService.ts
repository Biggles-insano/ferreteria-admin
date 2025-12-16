import api from './api';

export interface Sale {
    id: number;
    fecha_factura: string;
    serie: string;
    folio: number;
    monto_total: number;
    estado: 'pendiente' | 'pagada' | 'cancelada';
    cliente?: { nombre: string };
    vendedor?: { nombre: string };
}

export const salesService = {
    getSales: async (): Promise<Sale[]> => {
        const response = await api.get<Sale[]>('/ventas/facturas');
        return response.data;
    },

    createPedido: async (pedidoData: any) => {
        const response = await api.post('/ventas/pedidos', pedidoData);
        return response.data;
    }
};
