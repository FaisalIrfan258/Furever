import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://furever-wzh5.onrender.com/api", // This would be your API base URL in production
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (userData: any) => api.post("/auth/register", userData),
  registerShelter: (shelterData: any) => api.post("/auth/register/shelter", shelterData),
  login: (credentials: any) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData: any) => api.put("/auth/me", userData),
}

// Pets API
export const petsAPI = {
  getAllPets: (params?: any) => api.get("/pets", { params }),
  getPetById: (id: string) => api.get(`/pets/${id}`),
  createPet: (petData: any) => api.post("/pets", petData),
  updatePet: (id: string, petData: any) => api.put(`/pets/${id}`, petData),
  deletePet: (id: string) => api.delete(`/pets/${id}`),
  uploadPetImages: (id: string, formData: FormData) =>
    api.post(`/pets/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
}

// Adoptions API
export const adoptionsAPI = {
  submitApplication: (applicationData: any) => api.post("/adoption", applicationData),
  getUserApplications: () => api.get("/adoption/me"),
  getShelterApplications: () => api.get("/adoption/shelter"),
  getApplicationById: (id: string) => api.get(`/adoption/${id}`),
  updateApplicationStatus: (id: string, statusData: any) => api.put(`/adoption/${id}/status`, statusData),
}

// Lost & Found API
export const lostFoundAPI = {
  reportLostPet: (reportData: any) => api.post("/lost-found/lost", reportData),
  reportFoundPet: (reportData: any) => api.post("/lost-found/found", reportData),
  getAllReports: (params?: any) => api.get("/lost-found", { params }),
  getReportById: (id: string) => api.get(`/lost-found/${id}`),
  updateReport: (id: string, reportData: any) => api.put(`/lost-found/${id}`, reportData),
  updateReportStatus: (id: string, statusData: any) => api.put(`/lost-found/${id}/status`, statusData),
  uploadPetImages: (id: string, formData: FormData) => 
    api.post(`/lost-found/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
}

// Rescue Operations API
export const rescueAPI = {
  createRescueOperation: (rescueData: any) => api.post("/rescue", rescueData),
  getAllRescueOperations: (params?: any) => api.get("/rescue", { params }),
  getRescueById: (id: string) => api.get(`/rescue/${id}`),
  updateRescue: (id: string, rescueData: any) => api.put(`/rescue/${id}`, rescueData),
  joinRescue: (id: string) => api.post(`/rescue/${id}/join`),
  updateRescueStatus: (id: string, statusData: any) => api.put(`/rescue/${id}/status`, statusData),
}

// Donations API
export const donationsAPI = {
  createDonation: (donationData: any) => api.post("/donations", donationData),
  getUserDonations: () => api.get("/donations/me"),
  getShelterDonations: () => api.get("/donations/shelter"),
}

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message: string) => api.post("/chatbot/chat", { message }),
  getConversationHistory: () => api.get("/chatbot/history"),
}

export default api
