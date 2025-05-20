"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export default function RoleGuard({ children, allowedRoles, redirectTo = "/login" }: RoleGuardProps) {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // If authentication check is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // If user is authenticated but doesn't have the required role
    if (!loading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      switch (user.role) {
        case "user":
          router.push("/dashboard")
          break
        case "shelter":
          router.push("/shelter")
          break
        case "admin":
          router.push("/admin")
          break
        default:
          router.push("/")
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, redirectTo, router])

  // Show loading or nothing while checking authentication
  if (loading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="ml-2">Loading...</p>
      </div>
    )
  }

  // If user has the required role, render the children
  if (allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  // This should not be visible, but just in case
  return null
}
