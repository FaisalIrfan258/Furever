"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { login } from "@/store/slices/auth-slice"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
})

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "shelter":
          router.push("/shelter")
          break
        default:
          router.push("/dashboard")
      }
    }
  }, [isAuthenticated, user, router])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await dispatch(
        login({
          email: values.email,
          password: values.password,
        }),
      ).unwrap()

      toast({
        title: "Login successful!",
        description: "Welcome back to Furever Pet Adoption Platform.",
      })

      // Router will handle redirect in the useEffect
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="ml-2">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your Furever account</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link href="/forgot-password" className="text-sm font-medium text-rose-600 hover:text-rose-500">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-rose-600 hover:text-rose-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
