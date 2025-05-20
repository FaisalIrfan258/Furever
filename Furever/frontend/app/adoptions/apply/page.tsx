"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { adoptionsAPI, petsAPI } from "@/lib/api"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Pet } from "@/types/pet"

// Form validation schema
const adoptionFormSchema = z.object({
  petId: z.string().min(1, "Pet ID is required"),
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantPhone: z.string().min(10, "Please enter a valid phone number"),
  applicantEmail: z.string().email("Please enter a valid email address"),
  homeType: z.string().min(1, "Please select a home type"),
  hasYard: z.boolean().optional(),
  yardDescription: z.string().optional(),
  hasOtherPets: z.boolean().optional(),
  otherPetsDescription: z.string().optional(),
  hasChildren: z.boolean().optional(),
  childrenDescription: z.string().optional(),
  workSchedule: z.string().min(1, "Please describe your work schedule"),
  experienceWithPets: z.string().min(1, "Please describe your experience with pets"),
  reasonForAdoption: z.string().min(10, "Please provide a detailed reason for wanting to adopt"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" })
  }),
})

type AdoptionFormValues = z.infer<typeof adoptionFormSchema>

// Loading component for Suspense fallback
function AdoptionLoadingState() {
  return (
    <div className="container mx-auto py-10 px-4 flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      <p>Loading application form...</p>
    </div>
  )
}

// Main component that safely uses useSearchParams
function AdoptionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const petId = searchParams.get("petId")
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pet, setPet] = useState<Pet | null>(null)
  const [loadingPet, setLoadingPet] = useState(true)

  // Initialize form with default values
  const form = useForm<AdoptionFormValues>({
    resolver: zodResolver(adoptionFormSchema),
    defaultValues: {
      petId: petId || "",
      applicantName: "",
      applicantPhone: "",
      applicantEmail: "",
      homeType: "",
      hasYard: false,
      yardDescription: "",
      hasOtherPets: false,
      otherPetsDescription: "",
      hasChildren: false,
      childrenDescription: "",
      workSchedule: "",
      experienceWithPets: "",
      reasonForAdoption: "",
      agreeToTerms: false,
    },
  })

  // Check authentication and redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userInfo = localStorage.getItem("user")
    
    if (!token || !userInfo) {
      // Save the current URL to redirect back after login
      localStorage.setItem("redirectAfterLogin", `/adoptions/apply?petId=${petId}`)
      router.push("/login")
      return
    }
    
    try {
      const user = JSON.parse(userInfo)
      // If user is not a regular user (e.g., they're a shelter or admin), redirect
      if (user.role !== "user") {
        router.push("/pets")
        return
      }
    } catch (e) {
      console.error("Error parsing user info:", e)
      router.push("/login")
      return
    }

    // Fetch pet details
    async function fetchPet() {
      if (!petId) {
        router.push("/pets")
        return
      }

      try {
        setLoadingPet(true)
        const response = await petsAPI.getPetById(petId)
        
        if (response.data && response.data.success && response.data.data) {
          setPet(response.data.data)
          // Check if pet is available
          if (response.data.data.availability.status !== "available") {
            setError("This pet is no longer available for adoption.")
          }
        } else {
          setError("Failed to load pet details")
          router.push("/pets")
        }
      } catch (err) {
        console.error("Error fetching pet details:", err)
        setError("Failed to load pet details")
      } finally {
        setLoadingPet(false)
      }
    }

    fetchPet()
  }, [router, petId])

  const onSubmit = async (values: AdoptionFormValues) => {
    try {
      setIsLoading(true)
      setError(null)

      // Format application data as required by the API
      const applicationData = {
        pet: petId,
        applicationDetails: {
          housingType: values.homeType,
          hasYard: values.hasYard,
          hasChildren: values.hasChildren,
          hasOtherPets: values.hasOtherPets,
          workSchedule: values.workSchedule,
          experienceWithPets: values.experienceWithPets,
          reasonForAdoption: values.reasonForAdoption
        }
      }

      // Submit application
      await adoptionsAPI.submitApplication(applicationData)

      setIsSubmitted(true)
      
      // Scroll to top to show success message
      window.scrollTo(0, 0)
    } catch (err: any) {
      console.error("Error submitting adoption application:", err)
      setError(err.response?.data?.message || "Failed to submit application. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Success message after form submission
  if (isSubmitted) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Alert className="bg-green-50 border-green-200 mb-6">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800">Application Submitted!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your adoption application has been successfully submitted. We'll review it and contact you soon.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Thank you for applying!</h1>
          <p className="mb-6 text-gray-600">
            The shelter will review your application and contact you. You can view the status of your application in your dashboard.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/adoptions/my-applications">View My Applications</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pets">Browse More Pets</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loadingPet) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading pet information...</p>
      </div>
    )
  }

  // Error state or pet not available
  if (error || !pet) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <Alert className="bg-red-50 border-red-200 mb-6">
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {error || "Pet not found or no longer available for adoption."}
          </AlertDescription>
        </Alert>
        
        <Button asChild className="mt-4">
          <Link href="/pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Available Pets
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/pets/${petId}`} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pet Profile
          </Link>
        </Button>
        
        <div className="mb-8 flex items-start gap-4 sm:gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={pet.photos[0]?.url || "/placeholder.svg"} 
              alt={pet.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Adopt {pet.name}</h1>
            <p className="text-gray-500 mb-1">{pet.breed} • {pet.age.value} {pet.age.unit}</p>
            <p className="text-gray-500">{pet.shelter.name}</p>
          </div>
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Adoption Application</CardTitle>
            <CardDescription>
              Please fill out this form to apply for adopting {pet.name}. The shelter will review your application and contact you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h2 className="text-lg font-medium">Your Information</h2>
                <FormField
                  control={form.control}
                  name="applicantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicantEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicantPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <h2 className="text-lg font-medium pt-4">Living Situation</h2>
                <FormField
                  control={form.control}
                  name="homeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Home</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment, house, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasYard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have a yard?</FormLabel>
                        <FormDescription>
                          Please indicate if your home has a yard for the pet.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("hasYard") && (
                  <FormField
                    control={form.control}
                    name="yardDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yard Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your yard (size, fenced, etc.)" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <h2 className="text-lg font-medium pt-4">Household</h2>
                <FormField
                  control={form.control}
                  name="hasChildren"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have children?</FormLabel>
                        <FormDescription>
                          Please indicate if there are children in your home.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("hasChildren") && (
                  <FormField
                    control={form.control}
                    name="childrenDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide ages and number of children" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="hasOtherPets"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have other pets?</FormLabel>
                        <FormDescription>
                          Please indicate if you have other pets at home.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("hasOtherPets") && (
                  <FormField
                    control={form.control}
                    name="otherPetsDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Pets Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your other pets (type, age, temperament)" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <h2 className="text-lg font-medium pt-4">Additional Information</h2>
                <FormField
                  control={form.control}
                  name="workSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Schedule</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your typical work schedule" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceWithPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience with Pets</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your experience with pets" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reasonForAdoption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Adoption</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Why do you want to adopt this pet?" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Terms and Conditions</FormLabel>
                        <FormDescription>
                          I agree that all information provided is accurate. I understand that submitting this application does not guarantee adoption.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 text-sm text-gray-500">
            <p>
              Your application will be reviewed by {pet.shelter.name}.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

// Main page component that wraps the form in Suspense
export default function AdoptionApplicationPage() {
  return (
    <Suspense fallback={<AdoptionLoadingState />}>
      <AdoptionForm />
    </Suspense>
  )
} 