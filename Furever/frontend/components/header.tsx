"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, User, Building2, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/slices/auth-slice"
import { Badge } from "@/components/ui/badge"

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Pets", href: "/pets" },
  { name: "Lost & Found", href: "/lost-found" },
  { name: "Rescue Operations", href: "/rescue" },
  { name: "Donate", href: "/donate" },
]

const userNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Applications", href: "/dashboard?tab=applications" },
  { name: "Lost & Found Reports", href: "/dashboard?tab=lost-found" },
  { name: "Donation History", href: "/dashboard?tab=donations" },
]

const shelterNavigation = [
  { name: "Dashboard", href: "/shelter" },
  { name: "Pet Management", href: "/shelter?tab=pets" },
  { name: "Applications", href: "/shelter?tab=applications" },
  { name: "Rescue Operations", href: "/shelter?tab=rescue" },
  { name: "Donations", href: "/shelter?tab=donations" },
]

const adminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "User Management", href: "/admin?tab=users" },
  { name: "Content Moderation", href: "/admin?tab=content" },
  { name: "System Statistics", href: "/admin?tab=statistics" },
  { name: "Admin Accounts", href: "/admin?tab=admins" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const userRole = user?.role || "user"

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getRoleNavigation = () => {
    switch (userRole) {
      case "shelter":
        return shelterNavigation
      case "admin":
        return adminNavigation
      default:
        return userNavigation
    }
  }

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin"
      case "shelter":
        return "/shelter"
      default:
        return "/dashboard"
    }
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "shelter":
        return <Building2 className="h-4 w-4" />
      case "admin":
        return <ShieldCheck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-rose-600">Furever</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {publicNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 text-gray-900 hover:text-rose-600 transition-colors",
                pathname === item.href && "text-rose-600",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {getRoleIcon()}
                  <span className="mr-1">{user?.name?.split(" ")[0] || "My Account"}</span>
                  {userRole !== "user" && (
                    <Badge variant={userRole === "shelter" ? "warning" : "info"} className="mr-1">
                      {userRole === "shelter" ? "Shelter" : "Admin"}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>Dashboard</Link>
                </DropdownMenuItem>
                {getRoleNavigation()
                  .slice(1)
                  .map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuItem asChild>
                  <Link href={`${getDashboardLink()}?tab=profile`}>Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-2xl font-bold text-rose-600">Furever</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {publicNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          {getRoleIcon()}
                          <span className="font-semibold">{user?.name}</span>
                          {userRole !== "user" && (
                            <Badge variant={userRole === "shelter" ? "warning" : "info"}>
                              {userRole === "shelter" ? "Shelter" : "Admin"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      {getRoleNavigation()
                        .slice(1)
                        .map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      <Link
                        href={`${getDashboardLink()}?tab=profile`}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
