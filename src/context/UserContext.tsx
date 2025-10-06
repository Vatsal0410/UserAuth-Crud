import React, { createContext, useContext, useState} from 'react'
import type { User } from '../types/user'

interface UserContextType {
  users: User[]
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user])
  }

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ))
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id))
  }

  const value = {
    users,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    loading,
    setLoading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUsers = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider')
  }
  return context
}