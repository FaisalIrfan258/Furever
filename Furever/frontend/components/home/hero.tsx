"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 pt-10 sm:pb-24 lg:flex lg:px-8 lg:py-32 items-center">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-16 sm:mt-24 lg:mt-0">
            <Link href="/about" className="inline-flex space-x-6">
              <span className="rounded-full bg-rose-600/10 px-3 py-1 text-sm font-semibold leading-6 text-rose-600 ring-1 ring-inset ring-rose-600/10">
                Our Mission
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <span>Learn about what we do</span>
              </span>
            </Link>
          </div>
          <h1 className="mt-6 sm:mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find your <span className="text-rose-600">furever</span> friend
          </h1>
          <p className="mt-4 sm:mt-6 text-lg leading-8 text-gray-600">
            Connect with shelters, rescue organizations, and pets looking for their forever homes. Our platform makes
            pet adoption simple, transparent, and joyful.
          </p>
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/pets">Find a Pet</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/register">Join as Shelter</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-10 sm:mt-16 flex max-w-2xl lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-16">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80"
                alt="Dog and cat - pet friends"
                className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] rounded-md shadow-2xl ring-1 ring-gray-900/10 object-cover object-center"
                onError={(e) => {
                  // Fallback to another dog image if the first one fails
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
