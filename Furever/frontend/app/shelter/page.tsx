"use client"

import RoleGuard from "@/components/auth/role-guard"
import ShelterDashboard from "@/components/dashboard/shelter-dashboard"

export default function ShelterPage() {
  return (
    <RoleGuard allowedRoles={["shelter", "admin"]}>
      <ShelterDashboard />
    </RoleGuard>
  )
}
