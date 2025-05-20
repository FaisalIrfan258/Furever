"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, MapPin, ArrowLeft, CheckCircle, XCircle, DollarSign, Calendar, LogIn } from "lucide-react"
import { petsAPI } from "@/lib/api"
import type { Pet } from "@/types/pet"

export default function PetDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPet() {
      try {
        setLoading(true)
        const petId = params.id as string
        const response = await petsAPI.getPetById(petId)
        
        if (response.data && response.data.success && response.data.data) {
          setPet(response.data.data)
        } else {
          setError("Failed to load pet details")
        }
      } catch (err) {
        console.error("Error fetching pet details:", err)
        setError("Failed to load pet details")
      } finally {
        setLoading(false)
      }
    }

    // Check authentication state
    function checkAuthState() {
      // Check if token exists in localStorage
      const token = localStorage.getItem("token")
      
      // Try to get user info from localStorage, checking both "user" and full JSON parsing
      let userInfo = null
      try {
        userInfo = localStorage.getItem("user")
        
        // If user info exists as string, parse it
        if (userInfo) {
          const user = JSON.parse(userInfo)
          console.log("User authenticated:", user)
          setIsLoggedIn(true)
          setUserRole(user.role)
          return
        }
        
        // If no user info found directly, check if user might be stored differently
        const fullUserResponse = localStorage.getItem("userResponse")
        if (fullUserResponse) {
          const parsedResponse = JSON.parse(fullUserResponse)
          if (parsedResponse && parsedResponse.user) {
            console.log("User authenticated from response:", parsedResponse.user)
            setIsLoggedIn(true)
            setUserRole(parsedResponse.user.role)
            // Also store this in the standard format for future use
            localStorage.setItem("user", JSON.stringify(parsedResponse.user))
            return
          }
        }
        
        // If token exists but no user info found, we're in a partial login state
        if (token) {
          console.warn("Token exists but user info missing")
        }
        
        // No valid login found
        setIsLoggedIn(false)
        setUserRole(null)
        
      } catch (e) {
        console.error("Error parsing user info:", e)
        setIsLoggedIn(false)
        setUserRole(null)
      }
    }

    fetchPet()
    checkAuthState()
  }, [params.id])

  const handleAdoptClick = () => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      // Save the current URL to redirect back after login
      localStorage.setItem("redirectAfterLogin", `/pets/${params.id}`)
      router.push("/login")
    } else {
      // Redirect to adoption application form
      router.push(`/adoptions/apply?petId=${params.id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="ml-2">Loading pet details...</p>
      </div>
    )
  }

  if (error || !pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
        <p className="text-gray-600 mb-8">The pet you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/pets">Browse Other Pets</Link>
        </Button>
      </div>
    )
  }

  // Calculate pet age in human-readable format
  const formatAge = (age: { value: number, unit: string }) => {
    return `${age.value} ${age.unit}${age.value !== 1 ? '' : ''}`;
  }

  // Get main photo URL
  const mainPhoto = pet.photos.find(photo => photo.isMain)?.url || 
    (pet.photos.length > 0 ? pet.photos[0].url : "/placeholder.svg");
  
  // Make an array of all photo URLs
  const allPhotos = pet.photos.map(photo => photo.url);

  // Format location info
  const formatLocation = (location: Pet['location']) => {
    if (location.address) {
      return `${location.address.city}, ${location.address.state}`;
    } else if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }
    return "Location unavailable";
  }

  // Check if pet is available for adoption
  const isPetAvailable = pet.availability.status === "available";
  
  // Check if user can apply for adoption (only users can adopt, not shelters or admins)
  const canApplyForAdoption = isLoggedIn && userRole === "user" && isPetAvailable;
  
  // If not logged in, we still show the button but will redirect to login
  const showAdoptButton = isPetAvailable;

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
                src={allPhotos[currentImageIndex] || mainPhoto}
                alt={pet.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {allPhotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allPhotos.map((image, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square overflow-hidden rounded-md ${
                      index === currentImageIndex ? "ring-2 ring-rose-600" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
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
                <Badge variant={pet.type === "dog" ? "default" : "secondary"} className="text-sm capitalize">
                  {pet.type}
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  {pet.availability.status}
                </Badge>
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              {formatLocation(pet.location)}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Age</span>
                <span className="block font-medium mt-1">
                  {formatAge(pet.age)}
                </span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Gender</span>
                <span className="block font-medium mt-1 capitalize">{pet.gender}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Size</span>
                <span className="block font-medium mt-1 capitalize">{pet.size}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <span className="block text-sm text-gray-500">Color</span>
                <span className="block font-medium mt-1 capitalize">{pet.color || "Not specified"}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center">
              <DollarSign className="text-green-600 h-5 w-5 mr-2" />
              <span className="font-medium">${pet.availability.adoptionFee}</span>
              <span className="ml-2 text-gray-500">adoption fee</span>
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
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Temperament</h3>
                      <p className="capitalize">{pet.behavior.temperament}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Training</h3>
                      <p>{pet.behavior.trained ? "House trained" : "Not house trained"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pet Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Compatibility</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <li className="flex items-center">
                            {pet.behavior.goodWith.children ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                            <span>Good with children</span>
                          </li>
                          <li className="flex items-center">
                            {pet.behavior.goodWith.dogs ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                            <span>Good with dogs</span>
                          </li>
                          <li className="flex items-center">
                            {pet.behavior.goodWith.cats ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                            <span>Good with cats</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Health</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <li className="flex items-center">
                            {pet.health.vaccinated ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                            <span>Vaccinated</span>
                          </li>
                          <li className="flex items-center">
                            {pet.health.neutered ? 
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                              <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                            <span>Spayed/Neutered</span>
                          </li>
                        </ul>
                        {pet.health.specialNeeds && (
                          <div className="mt-4 p-3 bg-amber-50 rounded-md">
                            <h4 className="text-sm font-medium text-amber-800">Special Needs:</h4>
                            <p className="text-sm text-amber-700 mt-1">
                              {pet.health.specialNeedsDescription || "This pet has special needs. Contact the shelter for more information."}
                            </p>
                          </div>
                        )}
                        {pet.health.medicalConditions && pet.health.medicalConditions.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium">Medical Conditions:</h4>
                            <ul className="mt-1 list-disc ml-5 text-sm">
                              {pet.health.medicalConditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h3>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Added on {new Date(pet.createdAt).toLocaleDateString()}
                          </span>
                        </div>
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
                        <p className="mt-1 font-medium">{pet.shelter.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                        <div className="mt-1 space-y-2">
                          <p>Email: {pet.shelter.email}</p>
                          <p>Phone: {pet.shelter.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p className="mt-1">
                          {pet.location.address?.street}<br />
                          {pet.location.address?.city}, {pet.location.address?.state} {pet.location.address?.zipCode}<br />
                          {pet.location.address?.country}
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button asChild variant="outline">
                          <Link href={`/shelters/${pet.shelter._id}`}>View Shelter Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {showAdoptButton && (
                <Button 
                  size="lg" 
                  className="flex-1 flex items-center justify-center gap-2" 
                  onClick={handleAdoptClick}
                  disabled={!isPetAvailable}
                >
                  {!isLoggedIn && <LogIn className="h-5 w-5 mr-1" />}
                  {isLoggedIn ? "Apply to Adopt" : "Sign in to Adopt"}
                </Button>
              )}
              
              {!isPetAvailable && (
                <Button size="lg" className="flex-1" disabled>
                  Not Available for Adoption
                </Button>
              )}

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
