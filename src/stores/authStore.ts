import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    role: string;
    branch: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Mock authentication for development - would be replaced with actual API calls
const mockAuthData = {
  id: '1',
  username: 'manager',
  role: 'manager',
  branch: 'main',
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would make an API call to authenticate
      // For demo purposes, we're using a mock
      if (window.electronAPI) {
        // Using Electron's IPC
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        set({ 
          isAuthenticated: true, 
          user: mockAuthData,
          isLoading: false 
        });
      } else {
        // Browser fallback for development
        if (username === 'admin' && password === 'password') {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          set({ 
            isAuthenticated: true, 
            user: mockAuthData,
            isLoading: false 
          });
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      });
    }
  },
  
  logout: () => {
    // In a real app, we would clear tokens, etc.
    set({ 
      isAuthenticated: false, 
      user: null 
    });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      // In a real app, we would validate the token
      if (window.electronAPI) {
        // Using Electron's IPC
        const authResult = await window.electronAPI.checkAuth();
        
        if (authResult.authenticated) {
          set({ 
            isAuthenticated: true,
            user: mockAuthData, // This would come from the response
            isLoading: false
          });
        } else {
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      } else {
        // Browser fallback for development
        const storedAuth = localStorage.getItem('auth');
        
        if (storedAuth) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
          set({ 
            isAuthenticated: true,
            user: mockAuthData,
            isLoading: false
          });
        } else {
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed'
      });
    }
  }
}));

export default useAuthStore;