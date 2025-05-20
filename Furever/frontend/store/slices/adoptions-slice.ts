import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { adoptionsAPI } from "@/lib/api"

interface Adoption {
  _id: string
  pet: {
    _id: string
    name: string
    images: string[]
  }
  user?: {
    _id: string
    name: string
    email: string
  }
  shelter?: {
    _id: string
    name: string
  }
  status: string
  applicationDetails: any
  references: any[]
  additionalComments: string
  createdAt: string
  updatedAt: string
}

interface AdoptionsState {
  userApplications: Adoption[]
  shelterApplications: Adoption[]
  currentApplication: Adoption | null
  loading: boolean
  error: string | null
}

const initialState: AdoptionsState = {
  userApplications: [],
  shelterApplications: [],
  currentApplication: null,
  loading: false,
  error: null,
}

export const submitAdoptionApplication = createAsyncThunk(
  "adoptions/submitApplication",
  async (applicationData: any, { rejectWithValue }) => {
    try {
      const response = await adoptionsAPI.submitApplication(applicationData)
      return response.data.adoption
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit application")
    }
  },
)

export const fetchUserApplications = createAsyncThunk(
  "adoptions/fetchUserApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adoptionsAPI.getUserApplications()
      return response.data.adoptions
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch applications")
    }
  },
)

export const fetchShelterApplications = createAsyncThunk(
  "adoptions/fetchShelterApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adoptionsAPI.getShelterApplications()
      return response.data.adoptions
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch applications")
    }
  },
)

export const fetchApplicationById = createAsyncThunk(
  "adoptions/fetchApplicationById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await adoptionsAPI.getApplicationById(id)
      return response.data.adoption
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch application")
    }
  },
)

export const updateApplicationStatus = createAsyncThunk(
  "adoptions/updateStatus",
  async ({ id, statusData }: { id: string; statusData: any }, { rejectWithValue }) => {
    try {
      const response = await adoptionsAPI.updateApplicationStatus(id, statusData)
      return response.data.adoption
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update application status")
    }
  },
)

const adoptionsSlice = createSlice({
  name: "adoptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Submit Application
      .addCase(submitAdoptionApplication.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitAdoptionApplication.fulfilled, (state, action) => {
        state.loading = false
        state.userApplications.unshift(action.payload)
      })
      .addCase(submitAdoptionApplication.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch User Applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.loading = false
        state.userApplications = action.payload
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Shelter Applications
      .addCase(fetchShelterApplications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShelterApplications.fulfilled, (state, action) => {
        state.loading = false
        state.shelterApplications = action.payload
      })
      .addCase(fetchShelterApplications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Application By ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false
        state.currentApplication = action.payload
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update Application Status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false

        // Update in shelter applications
        const shelterIndex = state.shelterApplications.findIndex((app) => app._id === action.payload._id)
        if (shelterIndex !== -1) {
          state.shelterApplications[shelterIndex] = action.payload
        }

        // Update in user applications
        const userIndex = state.userApplications.findIndex((app) => app._id === action.payload._id)
        if (userIndex !== -1) {
          state.userApplications[userIndex] = action.payload
        }

        // Update current application if it's the same
        if (state.currentApplication?._id === action.payload._id) {
          state.currentApplication = action.payload
        }
      })
  },
})

export default adoptionsSlice.reducer
