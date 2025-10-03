import { create } from "zustand"

export interface User{
    id: string
    name: string
    email: string
    department: string
}

interface UserState {
    users: User[]
    setUsers: (users: User[]) => void
    addUser: (user: User) => void
    updateUser: (user: User) => void
    deleteUser: (id: string) => void
}

export const useUserStore = create<UserState>()((set) => ({
    users: [],
    setUsers: (users: User[]) => set({ users }),
    addUser: (user: User) => set((state) => ({
        users: [...state.users, user]
    })),
    updateUser: (user:User) => set((state) => ({
        users: state.users.map((u) => u.id === user.id ? user : u)
        
    })),
    deleteUser: (id: string) => set((state) => ({
        users: [...state.users.filter((user) => user.id !== id)]
    }))
})
)