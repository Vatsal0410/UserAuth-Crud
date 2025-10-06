import Cookies from 'js-cookie'

export const authCookies = {
  setToken: (token: string) => {
    Cookies.set('auth_token', token, { 
      expires: 1,
      sameSite: 'strict'
    })
  },
  
  getToken: (): string | undefined => {
    return Cookies.get('auth_token')
  },
  
  removeToken: () => {
    Cookies.remove('auth_token')
  }
}