"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building2, ShieldCheck } from "lucide-react"

export default function RegisterRoleSelection() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/register/${selectedRole}`)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Join Furever</h1>
          <p className="mt-4 text-lg text-gray-600">Select the type of account you'd like to create</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "user" ? "ring-2 ring-rose-600" : "hover:shadow-md"
            }`}
            onClick={() => handleRoleSelect("user")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-rose-600" />
              </div>
              <CardTitle>Pet Adopter</CardTitle>
              <CardDescription>For individuals looking to adopt pets</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mr-2"></span>
                  Browse and apply to adopt pets
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mr-2"></span>
                  Report lost or found pets
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mr-2"></span>
                  Participate in rescue operations
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mr-2"></span>
                  Make donations to shelters
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedRole === "user" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleRoleSelect("user")}
              >
                Select
              </Button>
            </CardFooter>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "shelter" ? "ring-2 ring-rose-600" : "hover:shadow-md"
            }`}
            onClick={() => handleRoleSelect("shelter")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>Shelter / Rescue</CardTitle>
              <CardDescription>For animal shelters and rescue organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                  List pets for adoption
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                  Manage adoption applications
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                  Organize rescue operations
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                  Receive and manage donations
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedRole === "shelter" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleRoleSelect("shelter")}
              >
                Select
              </Button>
            </CardFooter>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "admin" ? "ring-2 ring-rose-600" : "hover:shadow-md"
            }`}
            onClick={() => handleRoleSelect("admin")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>For platform administrators (restricted)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Manage users and shelters
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Moderate platform content
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Access system statistics
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                  Manage admin accounts
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedRole === "admin" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleRoleSelect("admin")}
                disabled
              >
                Restricted
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button onClick={handleContinue} disabled={!selectedRole || selectedRole === "admin"}>
            Continue
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-rose-600 hover:text-rose-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
