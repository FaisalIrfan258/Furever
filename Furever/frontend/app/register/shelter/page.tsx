"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/store/hooks"
import { register as registerShelter } from "@/store/slices/auth-slice"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    shelterName: z.string().min(2, {
      message: "Shelter name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Please enter a valid phone number.",
    }),
    address: z.string().min(5, {
      message: "Please enter a valid address.",
    }),
    city: z.string().min(2, {
      message: "Please enter a valid city.",
    }),
    state: z.string().min(2, {
      message: "Please enter a valid state.",
    }),
    zip: z.string().min(5, {
      message: "Please enter a valid ZIP code.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export default function ShelterRegistration() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shelterName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      description: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const nextStep = async () => {
    if (step === 1) {
      const basicInfoValid = await form.trigger(["name", "shelterName", "email", "phone"])
      if (basicInfoValid) setStep(2)
    } else if (step === 2) {
      const addressValid = await form.trigger(["address", "city", "state", "zip", "description"])
      if (addressValid) setStep(3)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // In a real app, this would dispatch an action to register the shelter
      await dispatch(
        registerShelter({
          name: values.name,
          shelterName: values.shelterName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
          description: values.description,
          password: values.password,
          role: "shelter",
        }),
      ).unwrap()

      toast({
        title: "Registration successful!",
        description: "Your shelter account is pending verification. We'll notify you once it's approved.",
      })

      router.push("/shelter")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Register Your Shelter</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join as a shelter or rescue organization to list pets for adoption
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-rose-600" : "bg-gray-200"} text-white`}
              >
                1
              </div>
              <div className={`ml-4 text-sm font-medium ${step >= 1 ? "text-gray-900" : "text-gray-500"}`}>
                Basic Information
              </div>
            </div>
            <div className={`flex-1 border-t ${step > 1 ? "border-rose-600" : "border-gray-200"} mx-4`}></div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-rose-600" : "bg-gray-200"} text-white`}
              >
                2
              </div>
              <div className={`ml-4 text-sm font-medium ${step >= 2 ? "text-gray-900" : "text-gray-500"}`}>
                Shelter Details
              </div>
            </div>
            <div className={`flex-1 border-t ${step > 2 ? "border-rose-600" : "border-gray-200"} mx-4`}></div>
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-rose-600" : "bg-gray-200"} text-white`}
              >
                3
              </div>
              <div className={`ml-4 text-sm font-medium ${step >= 3 ? "text-gray-900" : "text-gray-500"}`}>
                Account Setup
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shelterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shelter/Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Happy Paws Rescue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@happypaws.org" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
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
            )}

            {step === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="94103" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shelter Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your shelter or rescue organization..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>Must be at least 8 characters long.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{" "}
                          <Link href="/terms" className="text-rose-600 hover:text-rose-500">
                            terms of service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-rose-600 hover:text-rose-500">
                            privacy policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Your shelter account will require verification before it becomes active.
                    We'll review your information and contact you within 1-2 business days.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              ) : (
                <Button type="button" variant="ghost" asChild>
                  <Link href="/register">Cancel</Link>
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
          </form>
        </Form>

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
