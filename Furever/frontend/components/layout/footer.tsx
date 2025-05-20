import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="https://facebook.com" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="https://instagram.com" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="https://twitter.com" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Furever Pet Adoption Platform. All rights reserved.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">About</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/about" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Resources</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/blog" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Pet Care Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Support</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/contact" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Legal</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link href="/privacy" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
