import { useState, useEffect } from 'react'
import { authCookies } from '../utils/cookies'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = authCookies.getToken()
    setIsAuthenticated(!!token)
  }, [])

  const login = (token: string) => {
    authCookies.setToken(token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    authCookies.removeToken()
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    login,
    logout,
    getToken: authCookies.getToken
  }
}