export interface Pet {
  _id: string
  name: string
  species: string
  breed: string
  age: number
  gender: string
  size: string
  color?: string
  description: string
  healthStatus?: string
  adoptionStatus: string
  images: string[]
  location: {
    street?: string
    city: string
    state: string
    zipCode?: string
    country?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  specialNeeds?: boolean
  goodWith?: string[]
  shelter: {
    _id: string
    name: string
    email?: string
    phone?: string
  }
  createdAt: string
  updatedAt?: string
}
