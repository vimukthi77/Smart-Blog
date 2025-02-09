'use client'
import Link from 'next/link'
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiRss } from 'react-icons/fi'
import { ThemeSwitch } from './ThemeSwitch'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
              BlogSpace
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover insightful articles, expert opinions, and the latest trends in technology, design, and development.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<FiTwitter />} label="Twitter" />
              <SocialLink href="#" icon={<FiGithub />} label="GitHub" />
              <SocialLink href="#" icon={<FiLinkedin />} label="LinkedIn" />
              <SocialLink href="#" icon={<FiInstagram />} label="Instagram" />
              <SocialLink href="/rss" icon={<FiRss />} label="RSS Feed" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/featured" text="Featured Posts" />
              <FooterLink href="/latest" text="Latest Articles" />
              <FooterLink href="/categories" text="Categories" />
              <FooterLink href="/write" text="Write for Us" />
              <FooterLink href="/newsletter" text="Newsletter" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/contact" text="Contact" />
              <FooterLink href="/privacy" text="Privacy Policy" />
              <FooterLink href="/terms" text="Terms of Service" />
              <FooterLink href="/sitemap" text="Sitemap" />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Subscribe to Newsletter</h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Get the latest posts and updates directly in your inbox.
            </p>
            <form className="mt-4">
              <div className="flex max-w-md flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} BlogSpace. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <ThemeSwitch />
              <select className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-800 dark:bg-gray-900">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link
    href={href}
    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
    aria-label={label}
  >
    {icon}
  </Link>
)

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <li>
    <Link
      href={href}
      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
    >
      {text}
    </Link>
  </li>
)

export default Footer
