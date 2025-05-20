"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import RoleGuard from "@/components/auth/role-guard"
import UserDashboard from "@/components/dashboard/user-dashboard"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Redirect based on role if authenticated
    if (!loading && isAuthenticated && user) {
      switch (user.role) {
        case "shelter":
          router.push("/shelter")
          break
        case "admin":
          router.push("/admin")
          break
        // For "user" role, we stay on this page
      }
    }
  }, [loading, isAuthenticated, user, router])

  return (
    <RoleGuard allowedRoles={["user"]}>
      <UserDashboard />
    </RoleGuard>
  )
}
