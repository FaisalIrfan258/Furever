import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { lostFoundAPI } from "@/lib/api"

interface LostFoundReport {
  _id: string
  type: "Lost" | "Found"
  name?: string
  species: string
  breed?: string
  age?: number
  gender?: string
  size?: string
  color: string
  description: string
  images: string[]
  dateLost?: string
  foundDate?: string
  lastSeen?: any
  foundLocation?: any
  status: string
  user: string
  contactDetails: any
  additionalInfo?: string
  createdAt: string
  updatedAt: string
}

interface LostFoundState {
  reports: LostFoundReport[]
  currentReport: LostFoundReport | null
  userReports: LostFoundReport[]
  loading: boolean
  error: string | null
  totalReports: number
  pagination: {
    page: number
    limit: number
    totalPages: number
  }
}

const initialState: LostFoundState = {
  reports: [],
  currentReport: null,
  userReports: [],
  loading: false,
  error: null,
  totalReports: 0,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
  },
}

export const reportLostPet = createAsyncThunk(
  "lostFound/reportLostPet",
  async (reportData: any, { rejectWithValue }) => {
    try {
      const response = await lostFoundAPI.reportLostPet(reportData)
      return response.data.report
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to report lost pet")
    }
  },
)

export const reportFoundPet = createAsyncThunk(
  "lostFound/reportFoundPet",
  async (reportData: any, { rejectWithValue }) => {
    try {
      const response = await lostFoundAPI.reportFoundPet(reportData)
      return response.data.report
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to report found pet")
    }
  },
)

export const fetchAllReports = createAsyncThunk(
  "lostFound/fetchAllReports",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await lostFoundAPI.getAllReports(params)
      return {
        reports: response.data.reports,
        count: response.data.count,
        pagination: response.data.pagination,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reports")
    }
  },
)

export const fetchReportById = createAsyncThunk(
  "lostFound/fetchReportById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await lostFoundAPI.getReportById(id)
      return response.data.report
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch report")
    }
  },
)

export const updateReport = createAsyncThunk(
  "lostFound/updateReport",
  async ({ id, reportData }: { id: string; reportData: any }, { rejectWithValue }) => {
    try {
      const response = await lostFoundAPI.updateReport(id, reportData)
      return response.data.report
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update report")
    }
  },
)

export const updateReportStatus = createAsyncThunk(
  "lostFound/updateReportStatus",
  async ({ id, statusData }: { id: string; statusData: any }, { rejectWithValue }) => {
    try {
      const response = await lostFoundAPI.updateReportStatus(id, statusData)
      return response.data.report
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update report status")
    }
  },
)

const lostFoundSlice = createSlice({
  name: "lostFound",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Report Lost Pet
      .addCase(reportLostPet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reportLostPet.fulfilled, (state, action) => {
        state.loading = false
        state.userReports.unshift(action.payload)
      })
      .addCase(reportLostPet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Report Found Pet
      .addCase(reportFoundPet.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reportFoundPet.fulfilled, (state, action) => {
        state.loading = false
        state.userReports.unshift(action.payload)
      })
      .addCase(reportFoundPet.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch All Reports
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload.reports
        state.totalReports = action.payload.count
        state.pagination = action.payload.pagination
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Report By ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false
        state.currentReport = action.payload
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update Report
      .addCase(updateReport.fulfilled, (state, action) => {
        const index = state.reports.findIndex((report) => report._id === action.payload._id)
        if (index !== -1) {
          state.reports[index] = action.payload
        }

        const userIndex = state.userReports.findIndex((report) => report._id === action.payload._id)
        if (userIndex !== -1) {
          state.userReports[userIndex] = action.payload
        }

        if (state.currentReport?._id === action.payload._id) {
          state.currentReport = action.payload
        }
      })
      // Update Report Status
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        const index = state.reports.findIndex((report) => report._id === action.payload._id)
        if (index !== -1) {
          state.reports[index] = action.payload
        }

        const userIndex = state.userReports.findIndex((report) => report._id === action.payload._id)
        if (userIndex !== -1) {
          state.userReports[userIndex] = action.payload
        }

        if (state.currentReport?._id === action.payload._id) {
          state.currentReport = action.payload
        }
      })
  },
})

export default lostFoundSlice.reducer
