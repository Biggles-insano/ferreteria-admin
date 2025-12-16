import api from './api';
import type { User } from '../types/auth'; // We might need to extend User type or create a new one

export interface CreateUserDTO {
    nombre: string;
    email: string;
    password: string;
    roles: string[];
}

export interface UpdateUserDTO {
    id: number;
    nombre?: string;
    email?: string;
    password?: string;
    roles?: string[];
    is_activo?: boolean;
}

export const getAllUsers = async (includeInactive: boolean = false): Promise<User[]> => {
    const response = await api.get<User[]>('/usuarios', {
        params: { includeInactive }
    });
    return response.data;
};

export const createUser = async (data: CreateUserDTO): Promise<User> => {
    const response = await api.post<User>('/usuarios', data);
    return response.data;
};

export const updateUser = async (id: number, data: Omit<UpdateUserDTO, 'id'>): Promise<User> => {
    const response = await api.put<User>(`/usuarios/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
};
