"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, Home, Search, Users } from "lucide-react"

type Statistic = {
  id: string
  name: string
  value: number
  icon: React.ReactNode
  description: string
}

// Mock statistics data
const mockStatistics: Statistic[] = [
  {
    id: "1",
    name: "Pets Adopted",
    value: 12568,
    icon: <Home className="h-6 w-6 text-rose-600" />,
    description: "Forever homes found",
  },
  {
    id: "2",
    name: "Active Shelters",
    value: 342,
    icon: <Users className="h-6 w-6 text-rose-600" />,
    description: "Partner organizations",
  },
  {
    id: "3",
    name: "Pets Available",
    value: 4721,
    icon: <Search className="h-6 w-6 text-rose-600" />,
    description: "Looking for homes",
  },
  {
    id: "4",
    name: "Happy Families",
    value: 15209,
    icon: <Heart className="h-6 w-6 text-rose-600" />,
    description: "Lives changed",
  },
]

export default function Statistics() {
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0])

  useEffect(() => {
    // In a real app, this would be an API call
    setStatistics(mockStatistics)

    // Animate the counters
    const duration = 2000 // 2 seconds
    const interval = 20 // Update every 20ms
    const steps = duration / interval

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++

      const progress = currentStep / steps

      if (currentStep <= steps) {
        setCounts(mockStatistics.map((stat) => Math.floor(stat.value * progress)))
      } else {
        setCounts(mockStatistics.map((stat) => stat.value))
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-16">
          Making a Difference Together
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          {statistics.map((stat, index) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                {counts[index].toLocaleString()}
              </dd>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
