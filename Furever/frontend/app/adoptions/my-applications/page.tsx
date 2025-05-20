"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Search, FileText } from "lucide-react"
import { adoptionsAPI } from "@/lib/api"

interface AdoptionApplication {
  _id: string;
  petId: string;
  userId: string;
  status: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  createdAt: string;
  updatedAt: string;
  pet?: {
    _id: string;
    name: string;
    breed: string;
    photos?: { url: string; isMain: boolean; }[]
  };
  shelter?: {
    _id: string;
    name: string;
  };
}

export default function MyApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<AdoptionApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userInfo = localStorage.getItem("user")
    
    if (!token || !userInfo) {
      router.push("/login?returnTo=/adoptions/my-applications")
      return
    }

    try {
      const user = JSON.parse(userInfo)
      // If not a regular user, redirect
      if (user.role !== "user") {
        router.push("/")
        return
      }
    } catch (e) {
      console.error("Error parsing user info:", e)
      router.push("/login")
      return
    }

    // Fetch user's adoption applications
    fetchApplications()
  }, [router])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      const response = await adoptionsAPI.getUserApplications()
      
      if (response.data && response.data.success && response.data.data) {
        setApplications(response.data.data)
      } else {
        setError("Failed to load your applications")
      }
    } catch (err) {
      console.error("Error fetching adoption applications:", err)
      setError("Failed to load your applications. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500 mb-4" />
        <p>Loading your adoption applications...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Adoption Applications</h1>
          <p className="text-gray-500">Track the status of your pet adoption applications</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/pets" className="flex items-center gap-2">
            <Search size={16} />
            Find More Pets
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!isLoading && applications.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't submitted any adoption applications yet. Browse our available pets to find your new best friend.
          </p>
          <Button asChild>
            <Link href="/pets">Browse Available Pets</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Card key={application._id} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {application.pet?.photos && application.pet.photos.length > 0 ? (
                  <img
                    src={application.pet.photos.find(p => p.isMain)?.url || application.pet.photos[0].url}
                    alt={application.pet?.name || "Pet"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {application.pet?.name || "Unknown Pet"}
                  </CardTitle>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Breed</p>
                    <p>{application.pet?.breed || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shelter</p>
                    <p>{application.shelter?.name || "Unknown Shelter"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted On</p>
                    <p>{formatDate(application.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/adoptions/${application._id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 