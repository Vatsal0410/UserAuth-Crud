export interface User {
    id: string
    name: string
    email: string
    department: string
}

export interface UserFormData {
    name: string
    email: string
    department: string
}

export interface UserStore {
    users: User[]
    setUsers: (users: User[]) => void
    addUser: (user: User) => void
    updateUser: (user: User) => void
    deleteUser: (id: string) => void
}