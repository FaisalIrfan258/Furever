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

// Statistics data
const statistics: Statistic[] = [
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
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0])

  useEffect(() => {
    // Animate the counters
    const duration = 2000 // 2 seconds
    const interval = 20 // Update every 20ms
    const steps = duration / interval

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++

      const progress = currentStep / steps

      if (currentStep <= steps) {
        setCounts(statistics.map((stat) => Math.floor(stat.value * progress)))
      } else {
        setCounts(statistics.map((stat) => stat.value))
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl text-center mb-10 sm:mb-16">
          Making a Difference Together
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-16 text-center">
          {statistics.map((stat, index) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-3">
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                <div className="flex justify-center mb-3 sm:mb-4">{stat.icon}</div>
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
