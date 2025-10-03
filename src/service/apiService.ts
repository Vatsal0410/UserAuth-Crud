import type { User } from "../store/userStore";


const API_URL = "https://crud-api-5f45.onrender.com";

// fetch api request
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`; 

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage)
    }
    if(response.status === 204) {
      return null;
    }
    return response.json();
  } catch (err: any) {
    if(err instanceof Error) {
      throw new Error(`Network error occurred ${err.message}`);
    }
  }
};

// auth service methods
export const authService = {
  login: async (email: string, password: string) => {
    return fetchAPI("login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (name: string, email: string, password: string) => {
    return fetchAPI("signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
};

// user service methods
export const userService = {
  fetchUsers: async (token: string): Promise<User[]> => {
    return fetchAPI("dashboard/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  addUser: async (
    token: string,
    user: {
      name: string;
      email: string;
      department: string;
    }
  ): Promise<User> => {
    return fetchAPI("dashboard/user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
  },
  updateUser: async (token: string, userId: string, user: Omit<User, "id">): Promise<User> => {
    const response =  await   fetchAPI(`dashboard/user/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    return response.updatedUser || response
  },
  deleteUser: async (token: string,userId: string) => {
    return fetchAPI(`dashboard/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  },
};
