"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PetCard from "@/components/pets/pet-card"
import type { Pet } from "@/types/pet"
import { petsAPI } from "@/lib/api"

export default function FeaturedPets() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [petsToShow, setPetsToShow] = useState(3)
  
  // Determine how many pets to show based on screen size
  const getResponsiveCardCount = () => {
    if (typeof window === 'undefined') return 3 // Default for SSR
    return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
  }

  const fetchLatestPets = async () => {
    try {
      setIsLoading(true)
      // Get the latest pets by sorting by createdAt in descending order
      const response = await petsAPI.getAllPets({
        limit: 10, // Fetch a few more than we need
        sort: "-createdAt" // Sort by newest first
      })
      
      // Use data from the new API response format
      if (response.data.data && response.data.data.length > 0) {
        setFeaturedPets(response.data.data)
      }
      setError(null)
    } catch (err) {
      console.error("Error fetching featured pets:", err)
      setError("Failed to load featured pets")
      // Fallback to empty array
      setFeaturedPets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestPets()
    
    // Update pets to show based on screen size
    const updatePetsToShow = () => {
      setPetsToShow(getResponsiveCardCount())
    }
    
    // Initialize petsToShow
    updatePetsToShow()
    
    // Handle responsive petsToShow value on window resize
    const handleResize = () => {
      updatePetsToShow()
      setCurrentIndex(0) // Reset index on resize
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Featured Pets</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious} 
              disabled={isLoading || featuredPets.length <= petsToShow}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext} 
              disabled={isLoading || featuredPets.length <= petsToShow}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : featuredPets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No featured pets available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPets.slice(currentIndex, currentIndex + petsToShow).map((pet) => (
              <PetCard key={pet._id || pet.id} pet={pet} />
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-10 text-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/pets">View All Pets</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
