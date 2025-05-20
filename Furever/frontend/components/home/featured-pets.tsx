"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PetCard from "@/components/pets/pet-card"
import type { Pet } from "@/types/pet"

// Mock data for featured pets
const mockFeaturedPets: Pet[] = [
  {
    id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 2,
    gender: "Male",
    size: "Large",
    description: "Friendly and energetic Golden Retriever looking for an active family.",
    images: ["/placeholder.svg?height=300&width=400"],
    shelterId: "shelter1",
    shelterName: "Happy Paws Shelter",
    location: "San Francisco, CA",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Whiskers",
    species: "Cat",
    breed: "Siamese",
    age: 3,
    gender: "Female",
    size: "Medium",
    description: "Elegant and affectionate Siamese cat who loves to cuddle.",
    images: ["/placeholder.svg?height=300&width=400"],
    shelterId: "shelter2",
    shelterName: "Feline Friends",
    location: "Los Angeles, CA",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Rex",
    species: "Dog",
    breed: "German Shepherd",
    age: 1,
    gender: "Male",
    size: "Large",
    description: "Intelligent and loyal German Shepherd puppy, great with kids.",
    images: ["/placeholder.svg?height=300&width=400"],
    shelterId: "shelter1",
    shelterName: "Happy Paws Shelter",
    location: "San Francisco, CA",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Luna",
    species: "Cat",
    breed: "Maine Coon",
    age: 2,
    gender: "Female",
    size: "Large",
    description: "Majestic Maine Coon with a gentle personality and fluffy coat.",
    images: ["/placeholder.svg?height=300&width=400"],
    shelterId: "shelter3",
    shelterName: "Kitty Haven",
    location: "Seattle, WA",
    status: "available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Max",
    species: "Dog",
    breed: "Beagle",
    age: 4,
    gender: "Male",
    size: "Medium",
    description: "Playful Beagle who loves outdoor adventures and snuggles.",
    images: ["/placeholder.svg?height=300&width=400"],
    shelterId: "shelter2",
    shelterName: "Feline Friends",
    location: "Los Angeles, CA",
    status: "available",
    createdAt: new Date().toISOString(),
  },
]

export default function FeaturedPets() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const petsToShow = 3

  useEffect(() => {
    // In a real app, this would be an API call
    setFeaturedPets(mockFeaturedPets)
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, featuredPets.length - petsToShow) : Math.max(0, prevIndex - 1),
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= featuredPets.length - petsToShow ? 0 : prevIndex + 1))
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Pets</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious} disabled={featuredPets.length <= petsToShow}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} disabled={featuredPets.length <= petsToShow}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {featuredPets.slice(currentIndex, currentIndex + petsToShow).map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/pets">View All Pets</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
