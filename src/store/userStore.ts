import { create } from "zustand"
import type { User, UserStore } from "../types/user"


export const useUserStore = create<UserStore>()((set) => ({
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