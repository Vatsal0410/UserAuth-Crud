export interface LoginFormData {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export interface AuthResponse {
    token: string
    message?: string
}

export interface AuthError {
    message: string
    status?: string
}