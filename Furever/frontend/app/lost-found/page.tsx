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
import { 
  Search, MapPin, Calendar, Phone, Mail, 
  Upload, Filter, Tag, Check, AlertCircle
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function LostFoundPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("browse")
  const [reports, setReports] = useState<any[]>([])
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(files)
    }
  }

  const handleLostPetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      const data = {
        type: "Lost",
        name: formData.get("name") as string,
        species: formData.get("species") as string,
        breed: formData.get("breed") as string,
        age: parseInt(formData.get("age") as string) || 0,
        gender: formData.get("gender") as string,
        size: formData.get("size") as string,
        color: formData.get("color") as string,
        description: formData.get("description") as string,
        dateLost: formData.get("dateLost") as string,
        lastSeen: {
          street: formData.get("street") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          zipCode: formData.get("zipCode") as string,
          coordinates: {
            lat: 0, // Would be populated with map selection
            lng: 0
          }
        },
        contactDetails: {
          phone: formData.get("phone") as string,
          email: formData.get("email") as string,
        },
        additionalInfo: formData.get("additionalInfo") as string,
      }

      const response = await lostFoundAPI.reportLostPet(data)
      
      // Handle image upload if there are images
      if (images.length > 0 && response.data.report._id) {
        const reportId = response.data.report._id
        const imageFormData = new FormData()
        images.forEach(img => imageFormData.append('images', img))
        
        // Upload the images using the API
        await lostFoundAPI.uploadPetImages(reportId, imageFormData)
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
        type: "Found",
        species: formData.get("species") as string,
        breed: formData.get("breed") as string || "Unknown",
        gender: formData.get("gender") as string || "Unknown",
        size: formData.get("size") as string,
        color: formData.get("color") as string,
        description: formData.get("description") as string,
        dateFound: formData.get("dateFound") as string,
        foundLocation: {
          street: formData.get("street") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          zipCode: formData.get("zipCode") as string,
          coordinates: {
            lat: 0, // Would be populated with map selection
            lng: 0
          }
        },
        contactDetails: {
          phone: formData.get("phone") as string,
          email: formData.get("email") as string,
        },
        additionalInfo: formData.get("additionalInfo") as string || "",
      }

      const response = await lostFoundAPI.reportFoundPet(data)
      
      // Handle image upload if there are images
      if (images.length > 0 && response.data.report._id) {
        const reportId = response.data.report._id
        const imageFormData = new FormData()
        images.forEach(img => imageFormData.append('images', img))
        
        // Upload the images using the API
        await lostFoundAPI.uploadPetImages(reportId, imageFormData)
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

  return (
    <div className="container mx-auto py-8">
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-8 rounded-lg mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Lost & Found Pets</h1>
        <p className="text-xl">Help reunite lost pets with their owners or find homes for found animals</p>
      </div>
      
      <Tabs defaultValue="browse" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="browse" className="text-lg py-3">
            <Search className="mr-2 h-5 w-5" />
            Browse Reports
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
        
        <TabsContent value="lost">
          <Card className="p-6 border-red-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-red-600">Report a Lost Pet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLostPetSubmit} className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">Pet Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Pet Name</label>
                      <Input name="name" required className="border-red-200 focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Species</label>
                      <Select name="species" required>
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Breed</label>
                      <Input name="breed" required className="border-red-200 focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age (years)</label>
                      <Input name="age" type="number" className="border-red-200 focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <Select name="gender" required>
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Size</label>
                      <Select name="size" required>
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <Input name="color" required className="border-red-200 focus:border-red-400" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Upload Images</label>
                      <div className="border-2 border-dashed border-red-200 rounded-lg p-4 text-center">
                        <Input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload" 
                        />
                        <label 
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-6 w-6 mb-2 text-red-500" />
                          <span className="text-sm text-gray-600">Click to upload pet photos</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {images.length > 0 ? `${images.length} images selected` : "JPG, PNG up to 5MB"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea name="description" required className="border-red-200 focus:border-red-400" />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">Last Seen Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date Lost</label>
                      <Input name="dateLost" type="date" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Street</label>
                      <Input name="street" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <Input name="city" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <Input name="state" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <Input name="zipCode" required className="border-orange-200 focus:border-orange-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number
                      </label>
                      <Input name="phone" type="tel" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </label>
                      <Input name="email" type="email" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Additional Information</label>
                    <Textarea 
                      name="additionalInfo" 
                      placeholder="Any distinguishing features, behavior, or other details that might help identify your pet"
                      className="border-blue-200 focus:border-blue-400"
                    />
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
                  <h3 className="font-semibold text-green-800 mb-2">Pet Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Species</label>
                      <Select name="species" required>
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Breed (if known)</label>
                      <Input name="breed" className="border-green-200 focus:border-green-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender (if known)</label>
                      <Select name="gender">
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Size</label>
                      <Select name="size" required>
                        <SelectTrigger className="border-green-200 focus:border-green-400">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <Input name="color" required className="border-green-200 focus:border-green-400" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Upload Images</label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4 text-center">
                        <Input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="found-image-upload" 
                        />
                        <label 
                          htmlFor="found-image-upload"
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-6 w-6 mb-2 text-green-500" />
                          <span className="text-sm text-gray-600">Click to upload pet photos</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {images.length > 0 ? `${images.length} images selected` : "JPG, PNG up to 5MB"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea 
                      name="description" 
                      required 
                      placeholder="Please describe the pet's appearance, behavior, and any distinctive features"
                      className="border-green-200 focus:border-green-400" 
                    />
                  </div>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                  <h3 className="font-semibold text-teal-800 mb-2">Found Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date Found</label>
                      <Input name="dateFound" type="date" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Street</label>
                      <Input name="street" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <Input name="city" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <Input name="state" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <Input name="zipCode" required className="border-teal-200 focus:border-teal-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number
                      </label>
                      <Input name="phone" type="tel" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </label>
                      <Input name="email" type="email" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Current Situation</label>
                    <Textarea 
                      name="additionalInfo" 
                      placeholder="Where is the pet now? Is it under your care or with someone else? Any specific needs?"
                      className="border-blue-200 focus:border-blue-400"
                    />
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