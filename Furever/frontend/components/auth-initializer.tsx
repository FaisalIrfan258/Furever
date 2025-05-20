"use client"

import { useEffect, type ReactNode } from "react"
import { useAppDispatch } from "@/store/hooks"
import { checkAuth } from "@/store/slices/auth-slice"

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return <>{children}</>
}
