"use client"

import { useState, useEffect } from "react"
import { rescueAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { 
  Calendar, MapPin, Users, Truck, AlertTriangle, 
  PawPrint, Heart, Search, Filter, Clock
} from "lucide-react"

interface RescueLocation {
  coordinates: number[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface RescueOperation {
  _id: string;
  animalType: string;
  condition: string;
  description: string;
  photos: string[];
  location: RescueLocation;
  urgencyLevel: "low" | "medium" | "high" | "emergency";
  status: string;
  assignedTo?: string;
  user?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RescuesPage() {
  const [rescues, setRescues] = useState<RescueOperation[]>([])
  const [myRescues, setMyRescues] = useState<RescueOperation[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")
  const [filters, setFilters] = useState({
    status: "all",
    location: "",
    species: "all"
  })

  useEffect(() => {
    if (activeTab === "browse") {
      fetchRescues()
    } else if (activeTab === "my-rescues") {
      fetchMyRescues()
    }
  }, [filters, activeTab])

  const fetchMyRescues = async () => {
    setLoading(true)
    try {
      const response = await rescueAPI.getUserRescues()
      if (response.data && response.data.data) {
        setMyRescues(response.data.data)
      } else {
        setMyRescues([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your rescue reports. Please try again.",
        variant: "destructive"
      })
      setMyRescues([])
    } finally {
      setLoading(false)
    }
  }

  const fetchRescues = async () => {
    setLoading(true)
    try {
      const apiFilters = {
        ...filters,
        status: filters.status === "all" ? undefined : filters.status,
        species: filters.species === "all" ? undefined : filters.species
      }
      const response = await rescueAPI.getAllRescueOperations(apiFilters)
      if (response.data && response.data.rescues) {
        setRescues(response.data.rescues)
      } else if (response.data && Array.isArray(response.data)) {
        setRescues(response.data)
      } else {
        setRescues([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rescue operations. Please try again.",
        variant: "destructive"
      })
      setRescues([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      // Create payload according to the API requirements
      const data = {
        animalType: formData.get("species") as string,
        condition: formData.get("condition") as string,
        description: formData.get("description") as string,
        photos: [], // Would be populated with uploaded images
        location: {
          coordinates: [0, 0], // Would be set with a map component
          address: {
            street: formData.get("street") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            zipCode: formData.get("zipCode") as string,
            country: formData.get("country") as string,
          }
        },
        urgencyLevel: "high" // Default to high urgency
      }

      const response = await rescueAPI.createRescueOperation(data)
      toast({
        title: "Success!",
        description: "Rescue operation created successfully.",
        variant: "default"
      })
      
      setActiveTab("browse")
      fetchRescues() // Refresh the list
      
      // Reset form fields
      const form = e.target as HTMLFormElement;
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create rescue operation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleJoinRescue = async (rescueId: string) => {
    try {
      await rescueAPI.joinRescue(rescueId)
      toast({
        title: "Success!",
        description: "You have joined the rescue operation.",
        variant: "default"
      })
      fetchRescues() // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join rescue operation. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Planned': return 'bg-blue-500'
      case 'In Progress': return 'bg-yellow-500'
      case 'Completed': return 'bg-green-500'
      case 'Cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }
  
  const handleUpdateStatus = async (rescueId: string, newStatus: string) => {
    try {
      const statusData = {
        status: newStatus,
        outcome: newStatus === "Completed" ? "Successfully completed the rescue operation" : "",
        animalsRescued: 0 // Would be set by user input in a more complete implementation
      }
      await rescueAPI.updateRescueStatus(rescueId, statusData)
      toast({
        title: "Success!",
        description: `Rescue status updated to ${newStatus}.`,
        variant: "default"
      })
      fetchRescues()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-rose-600 p-8 rounded-lg mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Rescue Operations</h1>
        <p className="text-xl">Help save animals in need through coordinated rescue missions</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="browse" className="text-lg py-3">
            <Search className="mr-2 h-5 w-5" />
            Browse Rescues
          </TabsTrigger>
          <TabsTrigger value="my-rescues" className="text-lg py-3">
            <Clock className="mr-2 h-5 w-5" />
            My Rescues
          </TabsTrigger>
          <TabsTrigger value="create" className="text-lg py-3">
            <Heart className="mr-2 h-5 w-5" />
            Create Rescue
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filter Rescue Operations</span>
                <Filter className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
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
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {rescues.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No rescue operations found</h3>
                  <p className="text-gray-500">Try adjusting your filters or create a new rescue operation</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rescues.map((rescue: any) => (
                    <Card key={rescue._id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4" style={{ borderTopColor: getStatusColor(rescue.status).replace('bg-', '#').replace('-500', '') }}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className={`${getStatusColor(rescue.status)} font-medium mb-2`}>
                            {rescue.status}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(rescue.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <CardTitle className="text-xl">{rescue.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-600 mb-4 line-clamp-2">{rescue.description}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                            <span>Rescue Date: {new Date(rescue.rescueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                            <span>{rescue.location.city}, {rescue.location.state}</span>
                          </div>
                          <div className="flex items-start">
                            <PawPrint className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                            <span>
                              {rescue.animals.map((animal: any) => (
                                `${animal.count} ${animal.species} (${animal.breed})`
                              )).join(', ')}
                            </span>
                          </div>
                          {rescue.participants && (
                            <div className="flex items-start">
                              <Users className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                              <span>{rescue.participants.length} volunteers</span>
                            </div>
                          )}
                          {rescue.resources && (
                            <div className="flex items-start">
                              <Truck className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                              <span className="line-clamp-1">
                                Needs: {rescue.resources.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        {rescue.status === "Planned" && (
                          <Button 
                            onClick={() => handleJoinRescue(rescue._id)} 
                            className="w-full bg-emerald-500 hover:bg-emerald-600"
                          >
                            Join Rescue
                          </Button>
                        )}
                        {rescue.status === "Planned" && (
                          <Button 
                            onClick={() => handleUpdateStatus(rescue._id, "In Progress")} 
                            variant="outline"
                            className="w-full border-emerald-500 text-emerald-500"
                          >
                            Mark as In Progress
                          </Button>
                        )}
                        {rescue.status === "In Progress" && (
                          <Button 
                            onClick={() => handleUpdateStatus(rescue._id, "Completed")} 
                            variant="outline"
                            className="w-full border-emerald-500 text-emerald-500"
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="my-rescues">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {myRescues.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No rescue reports found</h3>
                  <p className="text-gray-500">You haven't created any rescue operations yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRescues.map((rescue: any) => (
                    <Card key={rescue._id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4" style={{ borderTopColor: getStatusColor(rescue.status).replace('bg-', '#').replace('-500', '') }}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className={`${getStatusColor(rescue.status)} font-medium mb-2`}>
                            {rescue.status}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(rescue.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <CardTitle className="text-xl">Rescue Operation</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-600 mb-4 line-clamp-2">{rescue.description}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-start">
                            <PawPrint className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                            <span>{rescue.animalType}</span>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                            <span>{rescue.location.address.city}, {rescue.location.address.state}</span>
                          </div>
                          <div className="flex items-start">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                            <span>Urgency: {rescue.urgencyLevel}</span>
                          </div>
                          {rescue.assignedTo && (
                            <div className="flex items-start">
                              <Users className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                              <span>Assigned to: {rescue.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        {rescue.status === "pending" && (
                          <Button 
                            onClick={() => handleUpdateStatus(rescue._id, "In Progress")} 
                            variant="outline"
                            className="w-full border-emerald-500 text-emerald-500"
                          >
                            Mark as In Progress
                          </Button>
                        )}
                        {rescue.status === "in_progress" && (
                          <Button 
                            onClick={() => handleUpdateStatus(rescue._id, "Completed")} 
                            variant="outline"
                            className="w-full border-emerald-500 text-emerald-500"
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card className="p-6 border-emerald-200 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-emerald-600">Create New Rescue Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold text-emerald-800 mb-2">Animal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Animal Type *</label>
                      <Select name="species" required>
                        <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                          <SelectValue placeholder="Select animal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Wildlife">Wildlife</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Condition *</label>
                      <Input name="condition" required className="border-emerald-200 focus:border-emerald-400" placeholder="e.g., Injured, Malnourished, Trapped" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <Textarea 
                      name="description" 
                      required 
                      className="border-emerald-200 focus:border-emerald-400"
                      placeholder="Detailed description of the situation"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Street</label>
                      <Input name="street" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <Input name="city" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <Input name="state" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <Input name="zipCode" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <Input name="country" required className="border-blue-200 focus:border-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Coordinates will be determined based on the address.</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">Urgency Level</h3>
                  <div>
                    <Select name="urgencyLevel" required defaultValue="High">
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="emergency">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-lg py-6"
                >
                  {submitting ? "Creating..." : "Create Rescue Operation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 