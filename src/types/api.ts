export interface ApiResponse<T = any> {
    data?: T
    message: string
    token?: string
}

export interface ApiError {
    message: string
    status: string
}
