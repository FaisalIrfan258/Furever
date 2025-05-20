"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, MapPin, ArrowLeft } from "lucide-react"
import type { Pet } from "@/types/pet"

// Mock data for pet details
const mockPets: Record<string, Pet> = {
  "1": {
    id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 2,
    gender: "Male",
    size: "Large",
    description:
      "Buddy is a friendly and energetic Golden Retriever looking for an active family. He loves to play fetch, go for long walks, and cuddle on the couch. Buddy is great with children and other dogs, and he's fully house-trained. He knows basic commands like sit, stay, and come. Buddy would thrive in a home with a yard where he can run and play. He's up-to-date on all his vaccinations and is in excellent health.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    shelterId: "shelter1",
    shelterName: "Happy Paws Shelter",
    location: "San Francisco, CA",
    status: "available",
    createdAt: new Date().toISOString(),
    compatibility: {
      children: true,
      dogs: true,
      cats: false,
      otherAnimals: false,
    },
    healthInfo: {
      vaccinated: true,
      spayedNeutered: true,
      specialNeeds: "",
    },
  },
}

export default function PetDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll just use the mock data
    setLoading(true)

    const petId = params.id as string
    const fetchedPet = mockPets[petId]

    if (fetchedPet) {
      setPet(fetchedPet)
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="ml-2">Loading pet details...</p>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
        <p className="text-gray-600 mb-8">The pet you're looking for doesn't exist or has been adopted.</p>
        <Button asChild>
          <Link href="/pets">Browse Other Pets</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/pets" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pets
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
              <img
                src={pet.images[currentImageIndex] || "/placeholder.svg"}
                alt={pet.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {pet.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square overflow-hidden rounded-md ${
                      index === currentImageIndex ? "ring-2 ring-rose-600" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${pet.name} - image ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pet Details */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pet.name}</h1>
                <p className="text-lg text-gray-500">{pet.breed}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={pet.species === "Dog" ? "default" : "secondary"} className="text-sm">
                  {pet.species}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {pet.status === "available" ? "Available" : "Adopted"}
                </Badge>
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              {pet.location}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Age</span>
                <span className="block font-medium mt-1">
                  {pet.age} {pet.age === 1 ? "year" : "years"}
                </span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Gender</span>
                <span className="block font-medium mt-1">{pet.gender}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Size</span>
                <span className="block font-medium mt-1">{pet.size}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Listed</span>
                <span className="block font-medium mt-1">{new Date(pet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Tabs defaultValue="about" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shelter">Shelter</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About {pet.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{pet.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pet Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Compatibility</h3>
                        <ul className="mt-2 grid grid-cols-2 gap-2">
                          <li className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${pet.compatibility?.children ? "bg-green-500" : "bg-red-500"} mr-2`}
                            ></span>
                            <span>Good with children: {pet.compatibility?.children ? "Yes" : "No"}</span>
                          </li>
                          <li className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${pet.compatibility?.dogs ? "bg-green-500" : "bg-red-500"} mr-2`}
                            ></span>
                            <span>Good with dogs: {pet.compatibility?.dogs ? "Yes" : "No"}</span>
                          </li>
                          <li className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${pet.compatibility?.cats ? "bg-green-500" : "bg-red-500"} mr-2`}
                            ></span>
                            <span>Good with cats: {pet.compatibility?.cats ? "Yes" : "No"}</span>
                          </li>
                          <li className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${pet.compatibility?.otherAnimals ? "bg-green-500" : "bg-red-500"} mr-2`}
                            ></span>
                            <span>Good with other animals: {pet.compatibility?.otherAnimals ? "Yes" : "No"}</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Health</h3>
                        <ul className="mt-2 grid grid-cols-2 gap-2">
                          <li className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${pet.healthInfo?.vaccinated ? "bg-green-500" : "bg-red-500"} mr-2`}
                            ></span>
                            <span>Vaccinated: {pet.healthInfo?.vaccinated ? "Yes" : "No"}</span>
                          </li>
                          <li className="flex items-center">
                            <span
                              className={`h-2 w-2 rounded-full ${pet.healthInfo?.spayedNeutered ? "bg-green-500" : "bg-red-500"} mr-2`}
                            ></span>
                            <span>Spayed/Neutered: {pet.healthInfo?.spayedNeutered ? "Yes" : "No"}</span>
                          </li>
                        </ul>
                        {pet.healthInfo?.specialNeeds && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium">Special Needs:</h4>
                            <p className="text-sm text-gray-700">{pet.healthInfo.specialNeeds}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="shelter" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shelter Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Shelter Name</h3>
                        <p className="mt-1">{pet.shelterName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p className="mt-1">{pet.location}</p>
                      </div>
                      <div className="pt-4">
                        <Button asChild variant="outline">
                          <Link href={`/shelters/${pet.shelterId}`}>View Shelter Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1">
                Apply to Adopt
              </Button>
              <Button variant="outline" size="lg" className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5" />
                <span>Save</span>
              </Button>
              <Button variant="outline" size="lg" className="flex items-center justify-center gap-2">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
