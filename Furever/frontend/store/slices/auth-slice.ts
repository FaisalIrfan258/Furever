import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types/user"
import { authAPI } from "@/lib/api"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Check if user is already logged in
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      return null
    }

    const response = await authAPI.getProfile()
    return response.data.user
  } catch (error: any) {
    localStorage.removeItem("token")
    return rejectWithValue(error.response?.data?.message || "Authentication failed")
  }
})

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials)
      localStorage.setItem("token", response.data.token)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  },
)

export const register = createAsyncThunk("auth/register", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(userData)
    localStorage.setItem("token", response.data.token)
    return response.data.user
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Registration failed")
  }
})

export const registerShelter = createAsyncThunk(
  "auth/registerShelter",
  async (shelterData: any, { rejectWithValue }) => {
    try {
      const response = await authAPI.registerShelter(shelterData)
      localStorage.setItem("token", response.data.token)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Shelter registration failed")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authAPI.logout()
    localStorage.removeItem("token")
    return true
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed")
  }
})

export const updateProfile = createAsyncThunk("auth/updateProfile", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await authAPI.updateProfile(userData)
    return response.data.user
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Profile update failed")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        } else {
          state.user = null
          state.isAuthenticated = false
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Register Shelter
      .addCase(registerShelter.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerShelter.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(registerShelter.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
