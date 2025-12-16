export interface User {
    id: number;
    nombre: string;
    email: string;
    roles: string[]; // We will map backend roles to strings here
    is_activo?: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}
