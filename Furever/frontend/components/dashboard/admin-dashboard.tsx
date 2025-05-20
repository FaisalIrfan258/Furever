"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import Link from "next/link"
import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Users, Flag, BarChart } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span>Admin Dashboard</span>
                </div>
              </CardTitle>
              <CardDescription>Welcome, {user?.name}</CardDescription>
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
                  variant={activeTab === "users" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("users")}
                >
                  User Management
                </Button>
                <Button
                  variant={activeTab === "content" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("content")}
                >
                  Content Moderation
                </Button>
                <Button
                  variant={activeTab === "statistics" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("statistics")}
                >
                  System Statistics
                </Button>
                <Button
                  variant={activeTab === "admins" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("admins")}
                >
                  Admin Accounts
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
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Registered users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Flag className="h-5 w-5 text-red-600" />
                      Flagged Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Items to review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-green-600" />
                      Platform Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Actions today</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">No recent registrations.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button asChild className="w-full">
                        <Link href="/admin/users">Manage Users</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin/content">Moderate Content</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/admin/statistics">View Statistics</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <h1 className="text-3xl font-bold mb-6">User Management</h1>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No users registered yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Moderation Tab */}
            <TabsContent value="content">
              <h1 className="text-3xl font-bold mb-6">Content Moderation</h1>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No content flagged for review.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics">
              <h1 className="text-3xl font-bold mb-6">System Statistics</h1>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No statistics available yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Accounts Tab */}
            <TabsContent value="admins">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Accounts</h1>
                <Button asChild>
                  <Link href="/admin/accounts/new">Add New Admin</Link>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">You</Badge>
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
