"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Grid, List, SlidersHorizontal, MapPin, X } from "lucide-react"
import PetCard from "@/components/pets/pet-card"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchPets } from "@/store/slices/pets-slice"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// // Mock data for pets
// const mockPets = [
//   {
//     _id: "1",
//     name: "Buddy",
//     species: "Dog",
//     breed: "Golden Retriever",
//     age: 2,
//     gender: "Male",
//     size: "Large",
//     description: "Friendly and energetic Golden Retriever looking for an active family.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter1",
//     shelterName: "Happy Paws Shelter",
//     location: { city: "San Francisco", state: "CA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "2",
//     name: "Whiskers",
//     species: "Cat",
//     breed: "Siamese",
//     age: 3,
//     gender: "Female",
//     size: "Medium",
//     description: "Elegant and affectionate Siamese cat who loves to cuddle.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter2",
//     shelterName: "Feline Friends",
//     location: { city: "Los Angeles", state: "CA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "3",
//     name: "Rex",
//     species: "Dog",
//     breed: "German Shepherd",
//     age: 1,
//     gender: "Male",
//     size: "Large",
//     description: "Intelligent and loyal German Shepherd puppy, great with kids.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter1",
//     shelterName: "Happy Paws Shelter",
//     location: { city: "San Francisco", state: "CA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "4",
//     name: "Luna",
//     species: "Cat",
//     breed: "Maine Coon",
//     age: 2,
//     gender: "Female",
//     size: "Large",
//     description: "Majestic Maine Coon with a gentle personality and fluffy coat.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter3",
//     shelterName: "Kitty Haven",
//     location: { city: "Seattle", state: "WA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "5",
//     name: "Max",
//     species: "Dog",
//     breed: "Beagle",
//     age: 4,
//     gender: "Male",
//     size: "Medium",
//     description: "Playful Beagle who loves outdoor adventures and snuggles.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter2",
//     shelterName: "Feline Friends",
//     location: { city: "Los Angeles", state: "CA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "6",
//     name: "Bella",
//     species: "Dog",
//     breed: "Labrador Retriever",
//     age: 3,
//     gender: "Female",
//     size: "Large",
//     description: "Sweet and gentle Labrador who loves water and playing fetch.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter1",
//     shelterName: "Happy Paws Shelter",
//     location: { city: "San Francisco", state: "CA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "7",
//     name: "Oliver",
//     species: "Cat",
//     breed: "Tabby",
//     age: 1,
//     gender: "Male",
//     size: "Small",
//     description: "Curious and playful tabby kitten who loves to explore.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter3",
//     shelterName: "Kitty Haven",
//     location: { city: "Seattle", state: "WA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     _id: "8",
//     name: "Charlie",
//     species: "Dog",
//     breed: "Poodle",
//     age: 5,
//     gender: "Male",
//     size: "Medium",
//     description: "Intelligent and hypoallergenic Poodle with a gentle temperament.",
//     images: ["/placeholder.svg?height=300&width=400"],
//     shelterId: "shelter2",
//     shelterName: "Feline Friends",
//     location: { city: "Los Angeles", state: "CA" },
//     status: "available",
//     createdAt: new Date().toISOString(),
//   },
// ]

export default function PetsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { pets, loading, totalPets, pagination } = useAppSelector((state) => state.pets)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filter states
  const [type, setType] = useState(searchParams.get("type") || "all")
  const [breed, setBreed] = useState(searchParams.get("breed") || "")
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 15])
  const [gender, setGender] = useState(searchParams.get("gender") || "all")
  const [size, setSize] = useState(searchParams.get("size") || "all")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [goodWithChildren, setGoodWithChildren] = useState(false)
  const [goodWithDogs, setGoodWithDogs] = useState(false)
  const [goodWithCats, setGoodWithCats] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    // Parse query parameters
    const typeParam = searchParams.get("type") || "all"
    const breedParam = searchParams.get("breed") || ""
    const genderParam = searchParams.get("gender") || "all"
    const sizeParam = searchParams.get("size") || "all"
    const locationParam = searchParams.get("location") || ""
    const pageParam = Number.parseInt(searchParams.get("page") || "1", 10)

    // Update state with query parameters
    setType(typeParam)
    setBreed(breedParam)
    setGender(genderParam)
    setSize(sizeParam)
    setLocation(locationParam)
    setPage(pageParam)

    // Prepare filter object for API call
    const filters: any = {
      page: pageParam,
      limit: 9,
    }

    if (typeParam !== "all") filters.type = typeParam
    if (breedParam) filters.breed = breedParam
    if (genderParam !== "all") filters.gender = genderParam
    if (sizeParam !== "all") filters.size = sizeParam
    if (locationParam) filters.location = locationParam

    // Add compatibility filters
    if (goodWithChildren) filters["behavior.goodWith.children"] = true
    if (goodWithDogs) filters["behavior.goodWith.dogs"] = true
    if (goodWithCats) filters["behavior.goodWith.cats"] = true

    // Fetch pets with filters
    dispatch(fetchPets(filters))
  }, [searchParams, dispatch, goodWithChildren, goodWithDogs, goodWithCats])

  const applyFilters = () => {
    // Update URL with filters
    const params = new URLSearchParams()
    if (type !== "all") params.set("type", type)
    if (breed) params.set("breed", breed)
    if (gender !== "all") params.set("gender", gender)
    if (size !== "all") params.set("size", size)
    if (location) params.set("location", location)
    params.set("page", "1") // Reset to first page when applying filters

    router.push(`/pets?${params.toString()}`)

    // Close filters on mobile
    if (window.innerWidth < 768) {
      setFiltersOpen(false)
    }
  }

  const resetFilters = () => {
    setType("all")
    setBreed("")
    setAgeRange([0, 15])
    setGender("all")
    setSize("all")
    setLocation("")
    setGoodWithChildren(false)
    setGoodWithDogs(false)
    setGoodWithCats(false)

    router.push("/pets")
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/pets?${params.toString()}`)
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">Find Your Perfect Pet</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className={`md:w-1/4 ${filtersOpen ? "block" : "hidden md:block"}`}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setFiltersOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="type">Pet Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="dog">Dogs</SelectItem>
                      <SelectItem value="cat">Cats</SelectItem>
                      <SelectItem value="bird">Birds</SelectItem>
                      <SelectItem value="small-animal">Small Animals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input id="breed" placeholder="Any breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
                </div>

                <div>
                  <Label>Age Range (years)</Label>
                  <div className="pt-2 px-2">
                    <Slider 
                      defaultValue={[0, 15]} 
                      max={15} 
                      step={1} 
                      value={ageRange} 
                      onValueChange={(value) => setAgeRange(value as [number, number])} 
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>{ageRange[0]} years</span>
                      <span>{ageRange[1]} years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any size</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="flex mt-1">
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Compatibility</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="goodWithChildren"
                        checked={goodWithChildren}
                        onCheckedChange={(checked) => setGoodWithChildren(checked as boolean)}
                      />
                      <label
                        htmlFor="goodWithChildren"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Good with children
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="goodWithDogs"
                        checked={goodWithDogs}
                        onCheckedChange={(checked) => setGoodWithDogs(checked as boolean)}
                      />
                      <label
                        htmlFor="goodWithDogs"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Good with dogs
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="goodWithCats"
                        checked={goodWithCats}
                        onCheckedChange={(checked) => setGoodWithCats(checked as boolean)}
                      />
                      <label
                        htmlFor="goodWithCats"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Good with cats
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={applyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Pet listings */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="md:hidden mr-2" onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{pets?.length || 0}</span> of{" "}
                  <span className="font-medium">{totalPets || 0}</span> pets
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-gray-500">Loading pets...</p>
              </div>
            ) : pets?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No pets found matching your criteria.</p>
                <Button variant="link" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
                      : "space-y-6"
                  }
                >
                  {pets?.map((pet) =>
                    viewMode === "grid" ? (
                      <PetCard key={pet._id} pet={pet} />
                    ) : (
                      <Card key={pet._id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/3">
                              <img
                                src={pet.photos && pet.photos.length > 0 ? pet.photos[0].url : "/placeholder.svg?height=300&width=400"}
                                alt={pet.name}
                                className="h-48 w-full object-cover object-center sm:h-full"
                              />
                            </div>
                            <div className="p-6 sm:w-2/3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                                  <p className="mt-1 text-sm text-gray-500">{pet.breed}</p>
                                </div>
                                <Badge variant={pet.type === "dog" ? "default" : "secondary"}>
                                  {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
                                </Badge>
                              </div>
                              <div className="mt-4 flex items-center text-sm text-gray-500">
                                <MapPin className="mr-1 h-4 w-4" />
                                {pet.location.address.city}, {pet.location.address.state}
                              </div>
                              <p className="mt-4 text-sm text-gray-600 line-clamp-2">{pet.description}</p>
                              <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                                <div className="bg-gray-100 p-2 rounded-md text-center">
                                  <span className="block font-medium">Age</span>
                                  <span>
                                    {pet.age.value} {pet.age.value === 1 ? pet.age.unit.slice(0, -1) : pet.age.unit}
                                  </span>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-md text-center">
                                  <span className="block font-medium">Gender</span>
                                  <span>{pet.gender}</span>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-md text-center">
                                  <span className="block font-medium">Size</span>
                                  <span>{pet.size}</span>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-md text-center">
                                  <span className="block font-medium">Shelter</span>
                                  <span className="truncate">{pet.shelter.name}</span>
                                </div>
                              </div>
                              <div className="mt-6">
                                <Button asChild>
                                  <Link href={`/pets/${pet._id}`}>View Details</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    disabled={pagination?.page === 1}
                    onClick={() => handlePageChange(pagination?.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={pagination?.page === pagination?.totalPages}
                    onClick={() => handlePageChange(pagination?.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
