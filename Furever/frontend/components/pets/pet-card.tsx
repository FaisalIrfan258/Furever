import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import type { Pet } from "@/types/pet"

interface PetCardProps {
  pet: Pet
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={pet.images[0] || "/placeholder.svg?height=300&width=400"}
          alt={pet.name}
          className="h-48 w-full object-cover object-center"
        />
      </div>
      <CardContent className="flex-1 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{pet.breed}</p>
          </div>
          <Badge variant={pet.species === "Dog" ? "default" : "secondary"}>{pet.species}</Badge>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          {pet.location}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-100 p-2 rounded-md text-center">
            <span className="block font-medium">Age</span>
            <span>
              {pet.age} {pet.age === 1 ? "year" : "years"}
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
            <span className="truncate">{pet.shelterName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/pets/${pet.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
