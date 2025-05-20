export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "shelter" | "admin"
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  profilePicture?: string
  isVerified?: boolean
  createdAt?: string
  updatedAt?: string
}
