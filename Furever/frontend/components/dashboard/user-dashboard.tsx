"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchUserApplications } from "@/store/slices/adoptions-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, AlertTriangle, DollarSign, User } from "lucide-react"

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { userApplications, loading } = useAppSelector((state) => state.adoptions)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    dispatch(fetchUserApplications())
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-rose-600" />
                  <span>My Account</span>
                </div>
              </CardTitle>
              <CardDescription>Welcome back, {user?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </Button>
                <Button
                  variant={activeTab === "applications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("applications")}
                >
                  Adoption Applications
                </Button>
                <Button
                  variant={activeTab === "lost-found" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("lost-found")}
                >
                  Lost & Found Reports
                </Button>
                <Button
                  variant={activeTab === "donations" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("donations")}
                >
                  Donation History
                </Button>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  Profile Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-600" />
                      Adoption Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{userApplications.length}</p>
                    <p className="text-sm text-gray-500">Total applications</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Lost & Found Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Active reports</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      Donations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">$0</p>
                    <p className="text-sm text-gray-500">Total donated</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Loading applications...</p>
                    ) : userApplications.length > 0 ? (
                      <div className="space-y-4">
                        {userApplications.slice(0, 3).map((application) => (
                          <div key={application._id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={application.pet.images[0] || "/placeholder.svg?height=40&width=40"}
                                alt={application.pet.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">{application.pet.name}</p>
                                <p className="text-sm text-gray-500">
                                  Applied on {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                application.status === "Approved"
                                  ? "success"
                                  : application.status === "Rejected"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No applications yet.</p>
                    )}

                    {userApplications.length > 0 && (
                      <div className="mt-4">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("applications")}>
                          View All Applications
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button asChild className="w-full">
                        <Link href="/pets">Browse Pets for Adoption</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/lost-found/report">Report Lost/Found Pet</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/donate">Make a Donation</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <h1 className="text-3xl font-bold mb-6">My Adoption Applications</h1>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-4 text-gray-500">Loading applications...</p>
                </div>
              ) : userApplications.length > 0 ? (
                <div className="space-y-6">
                  {userApplications.map((application) => (
                    <Card key={application._id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/4">
                            <img
                              src={application.pet.images[0] || "/placeholder.svg?height=200&width=200"}
                              alt={application.pet.name}
                              className="w-full h-40 object-cover rounded-md"
                            />
                          </div>
                          <div className="md:w-3/4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold">{application.pet.name}</h3>
                                <p className="text-sm text-gray-500">
                                  Applied on {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  application.status === "Approved"
                                    ? "success"
                                    : application.status === "Rejected"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {application.status}
                              </Badge>
                            </div>

                            <div className="mt-4">
                              <h4 className="font-medium">Shelter</h4>
                              <p>{application.shelter?.name || "Unknown Shelter"}</p>
                            </div>

                            <div className="mt-4 flex gap-4">
                              <Button asChild size="sm">
                                <Link href={`/adoptions/${application._id}`}>View Details</Link>
                              </Button>
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/pets/${application.pet._id}`}>View Pet</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't submitted any adoption applications yet.</p>
                    <Button asChild>
                      <Link href="/pets">Browse Pets for Adoption</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Lost & Found Tab */}
            <TabsContent value="lost-found">
              <h1 className="text-3xl font-bold mb-6">My Lost & Found Reports</h1>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't submitted any lost or found pet reports yet.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link href="/lost-found/report/lost">Report Lost Pet</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/lost-found/report/found">Report Found Pet</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations">
              <h1 className="text-3xl font-bold mb-6">My Donation History</h1>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                  <Button asChild>
                    <Link href="/donate">Make a Donation</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        value={user?.name || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        value={user?.email || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        value={user?.phone || ""}
                        readOnly
                      />
                    </div>

                    <div className="pt-4">
                      <Button>Edit Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
