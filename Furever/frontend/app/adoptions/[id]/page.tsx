"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, CheckCircle, Clock, Building } from "lucide-react"
import { adoptionsAPI } from "@/lib/api"

interface AdoptionApplication {
  _id: string;
  petId: string;
  userId: string;
  status: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  homeType: string;
  hasYard: boolean;
  yardDescription?: string;
  hasOtherPets: boolean;
  otherPetsDescription?: string;
  hasChildren: boolean;
  childrenDescription?: string;
  workSchedule: string;
  experienceWithPets: string;
  reasonForAdoption: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  pet?: {
    _id: string;
    name: string;
    type: string;
    breed: string;
    gender: string;
    age: {
      value: number;
      unit: string;
    };
    photos?: { url: string; isMain: boolean; }[]
  };
  shelter?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function ApplicationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  
  const [application, setApplication] = useState<AdoptionApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userInfo = localStorage.getItem("user")
    
    if (!token || !userInfo) {
      router.push("/login?returnTo=/adoptions/" + applicationId)
      return
    }

    // Fetch application details
    fetchApplicationDetails()
  }, [router, applicationId])

  const fetchApplicationDetails = async () => {
    try {
      setIsLoading(true)
      const response = await adoptionsAPI.getApplicationById(applicationId)
      
      if (response.data && response.data.success && response.data.data) {
        setApplication(response.data.data)
      } else {
        setError("Failed to load application details")
      }
    } catch (err) {
      console.error("Error fetching application details:", err)
      setError("Failed to load application details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get status badge
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
        <p>Loading application details...</p>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/adoptions/my-applications" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Applications
          </Link>
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Application not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/adoptions/my-applications" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Applications
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Pet and Shelter Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pet Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pet Information</CardTitle>
            </CardHeader>
            <CardContent>
              {application.pet ? (
                <div className="space-y-6">
                  <div className="aspect-square rounded-md overflow-hidden">
                    {application.pet.photos && application.pet.photos.length > 0 ? (
                      <img
                        src={application.pet.photos.find(p => p.isMain)?.url || application.pet.photos[0].url}
                        alt={application.pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{application.pet.name}</h3>
                    <p className="text-gray-600 capitalize">
                      {application.pet.breed} • {application.pet.gender}
                    </p>
                    <p className="text-gray-600">
                      {application.pet.age.value} {application.pet.age.unit}
                    </p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/pets/${application.petId}`}>View Pet Profile</Link>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Pet information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Shelter Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Shelter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.shelter ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{application.shelter.name}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Information</p>
                    <p className="mt-1">{application.shelter.email}</p>
                    <p>{application.shelter.phone}</p>
                  </div>
                  {application.shelter._id && (
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/shelters/${application.shelter._id}`}>View Shelter</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Shelter information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Application Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Current Status</span>
                  {getStatusBadge(application.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="mt-1">{formatDate(application.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="mt-1">{formatDate(application.updatedAt)}</p>
                </div>
                
                {application.statusHistory && application.statusHistory.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Status History</h4>
                    <div className="space-y-3">
                      {application.statusHistory.map((history, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3 py-1">
                          <div className="flex justify-between">
                            <span className="font-medium capitalize">{history.status}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(history.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          {history.note && <p className="text-sm text-gray-600 mt-1">{history.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Application Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Adoption Application Details</CardTitle>
                {getStatusBadge(application.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-medium mb-4">Applicant Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{application.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{application.applicantPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{application.applicantEmail}</p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-medium mb-4">Living Situation</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Home Type</p>
                      <p>{application.homeType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Has Yard</p>
                      <p>{application.hasYard ? "Yes" : "No"}</p>
                      {application.hasYard && application.yardDescription && (
                        <div className="mt-1 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{application.yardDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-medium mb-4">Household</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Has Children</p>
                      <p>{application.hasChildren ? "Yes" : "No"}</p>
                      {application.hasChildren && application.childrenDescription && (
                        <div className="mt-1 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{application.childrenDescription}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Has Other Pets</p>
                      <p>{application.hasOtherPets ? "Yes" : "No"}</p>
                      {application.hasOtherPets && application.otherPetsDescription && (
                        <div className="mt-1 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{application.otherPetsDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Work Schedule</p>
                      <div className="mt-1 bg-gray-50 p-3 rounded-md">
                        <p className="text-sm">{application.workSchedule}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience with Pets</p>
                      <div className="mt-1 bg-gray-50 p-3 rounded-md">
                        <p className="text-sm">{application.experienceWithPets}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reason for Adoption</p>
                      <div className="mt-1 bg-gray-50 p-3 rounded-md">
                        <p className="text-sm">{application.reasonForAdoption}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {application.status === 'approved' && (
                  <>
                    <Separator />
                    <section className="text-center">
                      <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-green-800">Your application has been approved!</h3>
                      <p className="text-gray-600 max-w-lg mx-auto mt-2">
                        Congratulations! The shelter has approved your application. 
                        They will contact you soon with next steps for completing the adoption process.
                      </p>
                    </section>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 