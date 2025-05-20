import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Pet } from "@/types/pet"
import { petsAPI } from "@/lib/api"

interface PetsState {
  pets: Pet[]
  featuredPets: Pet[]
  currentPet: Pet | null
  loading: boolean
  error: string | null
  totalPets: number
  pagination: {
    page: number
    limit: number
    totalPages: number
  }
}

const initialState: PetsState = {
  pets: [],
  featuredPets: [],
  currentPet: null,
  loading: false,
  error: null,
  totalPets: 0,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
}

export const fetchPets = createAsyncThunk("pets/fetchPets", async (filters: any, { rejectWithValue }) => {
  try {
    const response = await petsAPI.getAllPets(filters)
    return {
      pets: response.data.data,
      count: response.data.count,
      pagination: {
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        totalPages: response.data.pagination.pages
      }
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch pets")
  }
})

export const fetchPetById = createAsyncThunk("pets/fetchPetById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await petsAPI.getPetById(id)
    return response.data.pet
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch pet")
  }
})

export const fetchFeaturedPets = createAsyncThunk("pets/fetchFeaturedPets", async (_, { rejectWithValue }) => {
  try {
    // Featured pets could be a special endpoint or just a filter
    const response = await petsAPI.getAllPets({ featured: true, limit: 5 })
    return response.data.data || response.data.pets || []
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch featured pets")
  }
})

export const createPet = createAsyncThunk("pets/createPet", async (petData: any, { rejectWithValue }) => {
  try {
    const response = await petsAPI.createPet(petData)
    return response.data.pet
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create pet")
  }
})

export const updatePet = createAsyncThunk(
  "pets/updatePet",
  async ({ id, petData }: { id: string; petData: any }, { rejectWithValue }) => {
    try {
      const response = await petsAPI.updatePet(id, petData)
      return response.data.pet
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update pet")
    }
  },
)

export const deletePet = createAsyncThunk("pets/deletePet", async (id: string, { rejectWithValue }) => {
  try {
    await petsAPI.deletePet(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete pet")
  }
})

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload
    },
    setCurrentPet: (state, action: PayloadAction<Pet>) => {
      state.currentPet = action.payload
    },
    clearCurrentPet: (state) => {
      state.currentPet = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pets
      .addCase(fetchPets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false
        state.pets = action.payload.pets
        state.totalPets = action.payload.count
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Pet By ID
      .addCase(fetchPetById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPet = action.payload
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Featured Pets
      .addCase(fetchFeaturedPets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeaturedPets.fulfilled, (state, action) => {
        state.loading = false
        state.featuredPets = action.payload
      })
      .addCase(fetchFeaturedPets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create Pet
      .addCase(createPet.fulfilled, (state, action) => {
        state.pets.unshift(action.payload)
      })
      // Update Pet
      .addCase(updatePet.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet._id === action.payload._id)
        if (index !== -1) {
          state.pets[index] = action.payload
        }
        if (state.currentPet?._id === action.payload._id) {
          state.currentPet = action.payload
        }
      })
      // Delete Pet
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((pet) => pet._id !== action.payload)
        if (state.currentPet?._id === action.payload) {
          state.currentPet = null
        }
      })
  },
})

export const { setPets, setCurrentPet, clearCurrentPet } = petsSlice.actions
export default petsSlice.reducer
