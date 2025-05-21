"use client"

import { useState, useEffect } from "react"
import { lostFoundAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, MapPin, Calendar, Phone, Mail, 
  Upload, Filter, Tag, Check, AlertCircle, User
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function LostFoundPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("browse")
  const [reports, setReports] = useState<any[]>([])
  const [userReports, setUserReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    species: "all",
    location: "",
    status: "Open"
  })
  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    fetchReports()
  }, [filters])

  useEffect(() => {
    if (activeTab === "my-reports") {
      fetchUserReports()
    }
  }, [activeTab])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const apiFilters = {
        ...filters,
        type: filters.type === "all" ? undefined : filters.type,
        species: filters.species === "all" ? undefined : filters.species,
        status: filters.status === "all" ? undefined : filters.status
      }
      const response = await lostFoundAPI.getAllReports(apiFilters)
      if (response.data && response.data.reports) {
        setReports(response.data.reports)
      } else if (response.data && Array.isArray(response.data)) {
        setReports(response.data)
      } else {
        setReports([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive"
      })
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserReports = async () => {
    setLoading(true)
    try {
      const response = await lostFoundAPI.getUserReports()
      if (response.data && response.data.data) {
        setUserReports(response.data.data)
      } else {
        setUserReports([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your reports. Please try again.",
        variant: "destructive"
      })
      setUserReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      console.log('Images selected:', files.length, 'files')
      setImages(files)
    }
  }

  const handleLostPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      console.log('Starting form submission...')
      const formData = new FormData(e.target as HTMLFormElement)
      
      const data = {
        type: "lost",
        petDetails: {
          species: formData.get("species") as string,
          color: formData.get("color") as string,
          breed: formData.get("breed") as string,
          age: formData.get("age") as string || "unknown",
          gender: formData.get("gender") as string || "unknown",
          size: formData.get("size") as string || "unknown",
          distinctiveFeatures: formData.get("distinctiveFeatures") as string || ""
        },
        lastSeenLocation: {
          coordinates: [0, 0], // Would be populated with map selection
          address: {
            street: formData.get("street") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            country: "United States", // Default to US for now
            zipCode: formData.get("zipCode") as string
          },
          date: formData.get("dateLost") as string
        },
        description: formData.get("description") as string,
        contactInfo: {
          name: formData.get("contactName") as string,
          phone: formData.get("phone") as string,
          email: formData.get("email") as string,
          preferredContactMethod: formData.get("preferredContactMethod") as string || "both"
        },
        reward: {
          offered: Boolean(formData.get("rewardOffered")),
          amount: parseInt(formData.get("rewardAmount") as string) || 0
        }
      }

      console.log('Submitting report data:', data)
      const response = await lostFoundAPI.createReport(data)
      console.log('Report creation response:', response.data)
      
      // Handle image upload if there are images
      console.log('Current images state:', images.length, 'images')
      if (images.length > 0) {
        console.log('Has images to upload')
        if (response.data._id) {
          console.log('Got report ID:', response.data._id)
          const reportId = response.data._id
          const imageFormData = new FormData()
          images.forEach(img => {
            console.log('Appending image to FormData:', img.name)
            imageFormData.append('photos', img)
          })
          
          try {
            console.log('Starting image upload...')
            const uploadResponse = await lostFoundAPI.uploadPetImages(reportId, imageFormData)
            console.log('Image upload response:', uploadResponse)
          } catch (uploadError) {
            console.error('Error uploading images:', uploadError)
            toast({
              title: "Warning",
              description: "Report was created but there was an error uploading images. Please try uploading them again.",
              variant: "destructive"
            })
          }
        } else {
          console.error('No report ID in response:', response.data)
        }
      } else {
        console.log('No images to upload')
      }
      
      toast({
        title: "Success!",
        description: "Your lost pet report has been submitted.",
        variant: "default"
      })
      
      setActiveTab("browse")
      fetchReports()
      const form = e.target as HTMLFormElement;
      form.reset();
      setImages([])
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFoundPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      const data = {
        type: "found",
        petDetails: {
          species: formData.get("species") as string,
          color: formData.get("color") as string,
          breed: formData.get("breed") as string || "Unknown",
          age: formData.get("age") as string || "unknown",
          gender: formData.get("gender") as string || "unknown",
          size: formData.get("size") as string || "unknown",
          distinctiveFeatures: formData.get("distinctiveFeatures") as string || ""
        },
        lastSeenLocation: {
          coordinates: [0, 0], // Would be populated with map selection
          address: {
            street: formData.get("street") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            country: "United States", // Default to US for now
            zipCode: formData.get("zipCode") as string
          },
          date: formData.get("dateFound") as string
        },
        description: formData.get("description") as string,
        contactInfo: {
          name: formData.get("contactName") as string,
          phone: formData.get("phone") as string,
          email: formData.get("email") as string,
          preferredContactMethod: formData.get("preferredContactMethod") as string || "both"
        }
      }

      const response = await lostFoundAPI.createReport(data)
      
      // Handle image upload if there are images
      if (images.length > 0 && response.data._id) {
        const reportId = response.data._id
        const imageFormData = new FormData()
        images.forEach(img => imageFormData.append('photos', img))
        
        try {
          await lostFoundAPI.uploadPetImages(reportId, imageFormData)
          console.log('Images uploaded successfully')
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError)
          toast({
            title: "Warning",
            description: "Report was created but there was an error uploading images. Please try uploading them again.",
            variant: "destructive"
          })
        }
      }
      
      toast({
        title: "Success!",
        description: "Your found pet report has been submitted.",
        variant: "default"
      })
      
      setActiveTab("browse")
      fetchReports()
      const form = e.target as HTMLFormElement;
      form.reset();
      setImages([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const viewReportDetails = (id: string) => {
    router.push(`/lost-found/${id}`)
  }
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-yellow-500'
      case 'Resolved': return 'bg-green-500'
      case 'Closed': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  // Function to update report status
  const updateReportStatus = async (reportId: string, newStatus: string, details?: string) => {
    try {
      const statusData = {
        status: newStatus,
        resolutionDetails: details || ""
      }
      
      await lostFoundAPI.updateReportStatus(reportId, statusData)
      
      toast({
        title: "Status Updated",
        description: `Report status has been updated to ${newStatus}.`,
        variant: "default"
      })
      
      fetchReports()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  // Function to view the full report details
  const viewFullReportDetails = async (id: string) => {
    try {
      setLoading(true)
      const response = await lostFoundAPI.getReportById(id)
      
      // Here you would typically show a modal with the full details
      // For now, we'll just navigate to the details page
      router.push(`/lost-found/${id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch report details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Function to update report information
  const updateReportInfo = async (reportId: string, updatedData: any) => {
    try {
      await lostFoundAPI.updateReport(reportId, updatedData)
      
      toast({
        title: "Report Updated",
        description: "Report information has been successfully updated.",
        variant: "default"
      })
      
      fetchReports()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
      await lostFoundAPI.deleteReport(reportId)
      toast({
        title: "Success",
        description: "Report deleted successfully.",
        variant: "default"
      })
      fetchUserReports()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-rose-600 p-8 rounded-lg mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Lost & Found Pets</h1>
        <p className="text-xl">Help reunite lost pets with their owners or find homes for found animals</p>
      </div>
      
      <Tabs defaultValue="browse" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
       
          <TabsTrigger value="my-reports" className="text-lg py-3">
            <User className="mr-2 h-5 w-5" />
            My Reports
          </TabsTrigger>
          <TabsTrigger value="lost" className="text-lg py-3">
            <AlertCircle className="mr-2 h-5 w-5" />
            Report Lost Pet
          </TabsTrigger>
          <TabsTrigger value="found" className="text-lg py-3">
            <Check className="mr-2 h-5 w-5" />
            Report Found Pet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filter Reports</span>
                <Filter className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Report Type</label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => setFilters({...filters, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Reports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="Lost">Lost Pets</SelectItem>
                      <SelectItem value="Found">Found Pets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Species</label>
                  <Select 
                    value={filters.species} 
                    onValueChange={(value) => setFilters({...filters, species: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      <SelectItem value="Dog">Dogs</SelectItem>
                      <SelectItem value="Cat">Cats</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input 
                    placeholder="City or state" 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {reports.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No reports found</h3>
                  <p className="text-gray-500">Try adjusting your filters or create a new report</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map((report) => (
                    <Card key={report._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {report.images && report.images.length > 0 && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={report.images[0]} 
                            alt={report.name || `${report.species} ${report.breed}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className={`${getStatusColor(report.status)} font-medium mb-2`}>
                              {report.type} - {report.status}
                            </Badge>
                            <CardTitle className="text-xl">
                              {report.name ? report.name : `${report.species} (${report.breed})`}
                            </CardTitle>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-start">
                            <Tag className="h-4 w-4 mr-2 mt-0.5" />
                            <span>{report.species}, {report.breed}, {report.color}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                            <span>
                              {report.lastSeen?.city || report.foundLocation?.city}, 
                              {report.lastSeen?.state || report.foundLocation?.state}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                            <span>
                              {report.type === "Lost" ? "Lost on: " : "Found on: "}
                              {new Date(report.dateLost || report.dateFound).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        <Button 
                          onClick={() => viewFullReportDetails(report._id)} 
                          className="w-full"
                        >
                          View Details
                        </Button>
                        
                        {report.status === "Open" && (
                          <div className="grid grid-cols-2 gap-2 w-full mt-2">
                            <Button 
                              onClick={() => updateReportStatus(report._id, "Resolved", "Pet has been reunited with owner")} 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-500 hover:bg-green-50"
                            >
                              Mark Resolved
                            </Button>
                            <Button 
                              onClick={() => updateReportStatus(report._id, "Closed", "Report is no longer active")} 
                              variant="outline" 
                              size="sm"
                              className="border-gray-500 text-gray-500 hover:bg-gray-50"
                            >
                              Close Report
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="my-reports">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {userReports.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No reports found</h3>
                  <p className="text-gray-500">You haven't created any reports yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userReports.map((report) => (
                    <Card key={report._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {report.photos && report.photos.length > 0 && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={report.photos[0]} 
                            alt={report.petDetails.name || `${report.petDetails.species} ${report.petDetails.breed}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className={`${getStatusColor(report.status)} font-medium mb-2`}>
                              {report.type} - {report.status}
                            </Badge>
                            <CardTitle className="text-xl">
                              {report.petDetails.name ? report.petDetails.name : `${report.petDetails.species} (${report.petDetails.breed})`}
                            </CardTitle>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-start">
                            <Tag className="h-4 w-4 mr-2 mt-0.5" />
                            <span>{report.petDetails.species}, {report.petDetails.breed}, {report.petDetails.color}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                            <span>
                              {report.lastSeenLocation.address.city}, 
                              {report.lastSeenLocation.address.state}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                            <span>
                              {report.type === "lost" ? "Lost on: " : "Found on: "}
                              {new Date(report.lastSeenLocation.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <Button 
                            onClick={() => router.push(`/lost-found/${report._id}/edit`)}
                            variant="outline"
                            className="border-blue-500 text-blue-500 hover:bg-blue-50"
                          >
                            Edit Report
                          </Button>
                          <Button 
                            onClick={() => handleDeleteReport(report._id)}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                        {report.status === "open" && (
                          <div className="grid grid-cols-2 gap-2 w-full mt-2">
                            <Button 
                              onClick={() => updateReportStatus(report._id, "resolved", "Pet has been reunited")} 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-500 hover:bg-green-50"
                            >
                              Mark Resolved
                            </Button>
                            <Button 
                              onClick={() => updateReportStatus(report._id, "closed", "Report is no longer active")} 
                              variant="outline" 
                              size="sm"
                              className="border-gray-500 text-gray-500 hover:bg-gray-50"
                            >
                              Close Report
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="lost">
          <Card className="p-6 border-red-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-red-600">Report a Lost Pet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLostPetSubmit} className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">Pet Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Species*</label>
                      <Select name="species" required>
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color*</label>
                      <Input name="color" required className="border-red-200 focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Breed</label>
                      <Input name="breed" className="border-red-200 focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age</label>
                      <Select name="age">
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baby">Baby</SelectItem>
                          <SelectItem value="young">Young</SelectItem>
                          <SelectItem value="adult">Adult</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <Select name="gender">
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Size</label>
                      <Select name="size">
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Distinctive Features</label>
                    <Textarea 
                      name="distinctiveFeatures" 
                      placeholder="Any unique markings, scars, or identifying features?"
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">Last Seen Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date Lost*</label>
                      <Input name="dateLost" type="date" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Street*</label>
                      <Input name="street" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City*</label>
                      <Input name="city" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State*</label>
                      <Input name="state" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code*</label>
                      <Input name="zipCode" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name*</label>
                      <Input name="contactName" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number*
                      </label>
                      <Input name="phone" type="tel" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email*
                      </label>
                      <Input name="email" type="email" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                      <Select name="preferredContactMethod">
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">Additional Information</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description*</label>
                    <Textarea 
                      name="description" 
                      required
                      placeholder="Please provide any additional details about your lost pet and the circumstances..."
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rewardOffered"
                        name="rewardOffered"
                        onCheckedChange={(checked) => {
                          const rewardInput = document.querySelector('input[name="rewardAmount"]') as HTMLInputElement;
                          if (rewardInput) {
                            rewardInput.disabled = !checked;
                            if (!checked) rewardInput.value = '';
                          }
                        }}
                      />
                      <label
                        htmlFor="rewardOffered"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Offering a Reward
                      </label>
                    </div>
                    <div className="mt-2">
                      <Input 
                        name="rewardAmount" 
                        type="number" 
                        placeholder="Reward amount (if offering)"
                        className="border-purple-200 focus:border-purple-400"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Images</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Pet Images</label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="border-green-200 focus:border-green-400"
                    />
                    <p className="text-sm text-gray-500 mt-1">You can upload multiple images</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-lg py-6" 
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Lost Pet Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="found">
          <Card className="p-6 border-green-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">Report a Found Pet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFoundPetSubmit} className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Pet Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Species*</label>
                      <Select name="species" required>
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color*</label>
                      <Input name="color" required className="border-green-200 focus:border-green-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Breed (if known)</label>
                      <Input name="breed" className="border-green-200 focus:border-green-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age (if known)</label>
                      <Select name="age">
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baby">Baby</SelectItem>
                          <SelectItem value="young">Young</SelectItem>
                          <SelectItem value="adult">Adult</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender (if known)</label>
                      <Select name="gender">
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Size</label>
                      <Select name="size">
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Distinctive Features</label>
                    <Textarea 
                      name="distinctiveFeatures" 
                      placeholder="Any unique markings, scars, or identifying features?"
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                  <h3 className="font-semibold text-teal-800 mb-2">Found Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date Found*</label>
                      <Input name="dateFound" type="date" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Street*</label>
                      <Input name="street" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City*</label>
                      <Input name="city" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State*</label>
                      <Input name="state" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code*</label>
                      <Input name="zipCode" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name*</label>
                      <Input name="contactName" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number*
                      </label>
                      <Input name="phone" type="tel" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email*
                      </label>
                      <Input name="email" type="email" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                      <Select name="preferredContactMethod">
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">Additional Information</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description*</label>
                    <Textarea 
                      name="description" 
                      required
                      placeholder="Please provide details about where and how you found the pet, its current condition, and any other relevant information..."
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Images</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Pet Images</label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="border-green-200 focus:border-green-400"
                    />
                    <p className="text-sm text-gray-500 mt-1">You can upload multiple images</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-lg py-6" 
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Found Pet Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 