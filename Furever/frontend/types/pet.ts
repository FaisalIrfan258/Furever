export interface Pet {
  _id: string
  name: string
  type: string
  species?: string // For backward compatibility with old pet data
  breed: string
  gender: string
  size: string
  color?: string
  description: string
  age: {
    value: number
    unit: string
  }
  health: {
    vaccinated: boolean
    neutered: boolean
    medicalConditions: string[]
    specialNeeds: boolean
    specialNeedsDescription?: string
  }
  behavior: {
    goodWith: {
      children: boolean
      dogs: boolean
      cats: boolean
    }
    temperament: string
    trained: boolean
  }
  location: {
    address?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    coordinates?: [number, number]
    type?: string
    // For backward compatibility with old pet data
    city?: string
    state?: string
    zipCode?: string
    country?: string
    street?: string
  }
  availability: {
    status: string
    adoptionFee: number
  }
  photos: {
    url: string
    publicId: string
    isMain: boolean
    _id: string
  }[]
  shelter: {
    _id: string
    name: string
    email: string
    phone: string
  }
  // For backward compatibility
  shelterName?: string
  images?: string[]
  id?: string
  createdAt: string
  updatedAt: string
}
