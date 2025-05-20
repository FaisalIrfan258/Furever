import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "About Furever | Making Pet Adoption Simple",
  description: "Learn about Furever's mission to connect animals in need with caring forever homes and our commitment to improving animal welfare.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
          About <span className="text-rose-600">Furever</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Connecting pets in need with loving homes since 2020
        </p>
      </div>

      {/* Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 sm:mb-16 md:mb-20">
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1200"
            alt="Team working with shelter animals"
            fill
            className="object-cover shadow-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">Our Mission</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
            At Furever, we believe every pet deserves a loving home. Our mission is to connect animals in need with
            caring individuals and families, while supporting shelters and rescue organizations in their vital work.
          </p>
          <div className="space-y-3 sm:space-y-4 text-gray-600 text-base">
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                Simplify adoption.
              </dt>
              <dd className="inline">
                {" "}
                We streamline the pet adoption process, making it easier for shelters to showcase their animals and
                for adopters to find their perfect match.
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                Reunite lost pets.
              </dt>
              <dd className="inline">
                {" "}
                Our lost and found system helps reunite lost pets with their families quickly and efficiently.
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                Support rescue efforts.
              </dt>
              <dd className="inline">
                {" "}
                We coordinate and promote animal rescue operations, mobilizing volunteers and resources where
                they're needed most.
              </dd>
            </div>
            <div className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <div className="absolute left-1 top-1 h-5 w-5 text-rose-600 text-xl">•</div>
                Fund vital work.
              </dt>
              <dd className="inline">
                {" "}
                Our donation platform ensures that shelters and rescue organizations receive the financial support
                they need to continue their important work.
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 text-center">Our Story</h2>
        <div className="bg-gray-50 p-6 sm:p-8 rounded-xl">
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Furever was founded in 2020 by a group of animal welfare advocates who saw a need for a more efficient,
            technology-driven approach to pet adoption. After volunteering at local shelters, our founders noticed
            the challenges faced by both shelters and potential adopters in connecting with each other.
          </p>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
            Starting with just a handful of partner shelters in one city, we've grown to work with hundreds of
            shelters and rescue organizations across the country. Our platform has helped thousands of pets find
            their forever homes, reunited countless lost animals with their families, and channeled millions in
            donations to support animal welfare initiatives.
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            Today, we continue to innovate and expand our services, always guided by our core belief that every pet
            deserves love, care, and a place to call home.
          </p>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              name: "Emma Wilson",
              role: "Founder & CEO",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300",
              bio: "Former shelter director with 15+ years in animal welfare",
            },
            {
              name: "Michael Chen",
              role: "CTO",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
              bio: "Tech entrepreneur passionate about using technology for social good",
            },
            {
              name: "Olivia Garcia",
              role: "Head of Shelter Relations",
              image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300",
              bio: "Veterinarian with extensive experience in shelter medicine",
            },
            {
              name: "James Wilson",
              role: "Community Outreach Director",
              image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300",
              bio: "Former nonprofit leader dedicated to building meaningful partnerships",
            },
          ].map((member, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 mb-4 rounded-md overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-rose-600 mb-2">{member.role}</p>
              <p className="text-sm sm:text-base text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section - NEW */}
      <div className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 text-center">Our Partners</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center">
          {[
            "https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=200",
            "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=200",
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=200",
            "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=200"
          ].map((logo, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-24 sm:h-28 md:h-32">
              <div className="relative w-full h-full">
                <Image
                  src={logo}
                  alt={`Partner organization ${index + 1}`}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 text-center">Our Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {[
            { stat: "12,500+", label: "Pets Adopted" },
            { stat: "340+", label: "Partner Shelters" },
            { stat: "$2.5M+", label: "Donations Facilitated" },
          ].map((item, index) => (
            <div key={index} className="text-center p-6 sm:p-8 bg-rose-50 rounded-xl">
              <p className="text-3xl sm:text-4xl font-bold text-rose-600 mb-2">{item.stat}</p>
              <p className="text-gray-700">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section - NEW */}
      <div className="mb-12 sm:mb-16 md:mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 text-center">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=300",
            "https://images.unsplash.com/photo-1550431241-a2b960657a5e?q=80&w=300",
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=300",
            "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=300",
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300",
            "https://images.unsplash.com/photo-1596854273338-cbf078ec7071?q=80&w=300",
            "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=300",
            "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=300"
          ].map((photo, index) => (
            <div key={index} className="relative w-full pt-[100%] rounded-lg overflow-hidden">
              <Image
                src={photo}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Get Involved CTA */}
      <div className="bg-rose-600 text-white rounded-xl p-6 sm:p-8 md:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Get Involved</h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          Whether you're looking to adopt, volunteer, or donate, there are many ways to support our mission and help
          animals in need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
            <Link href="/pets">Find a Pet</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-rose-600 w-full sm:w-auto" asChild>
            <Link href="/donate">Make a Donation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 