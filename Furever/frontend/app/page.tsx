import Hero from "@/components/home/hero"
import FeaturedPets from "@/components/home/featured-pets"
import Statistics from "@/components/home/statistics"
import QuickAccess from "@/components/home/quick-access"
import About from "@/components/home/about"
import Testimonials from "@/components/home/testimonials"
import ChatBot from "@/components/home/chat-bot"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <Hero />
      <FeaturedPets />
      <Statistics />
      <QuickAccess />
      <About />
      <Testimonials />
      <ChatBot />
    </div>
  )
}
