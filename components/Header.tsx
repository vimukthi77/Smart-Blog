'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeSwitch } from './ThemeSwitch'
import { FiSearch, FiEdit, FiUser, FiLogOut } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface User {
    name: string;
    isLoggedIn: boolean;
    role: string;
}

const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user?.name) {
      setUser({
        name: session.user.name,
        isLoggedIn: true,
        role: 'READER' // Default role for Google users
      })
    } else {
      const token = localStorage.getItem('token')
      const userName = localStorage.getItem('userName')
      const userRole = localStorage.getItem('userRole')
      
      if (token && userName && userRole) {
        setUser({
          name: userName,
          isLoggedIn: true,
          role: userRole
        })
      }
    }

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token')
      const updatedUserName = localStorage.getItem('userName')
      const updatedUserRole = localStorage.getItem('userRole')
      if (updatedToken && updatedUserName && updatedUserRole) {
        setUser({
          name: updatedUserName,
          isLoggedIn: true,
          role: updatedUserRole
        })
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [session])

  const handleLogout = () => {
    if (session) {
      signOut({ callbackUrl: '/auth' })
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('userRole')
      setUser(null)
      router.push('/auth')
    }
  }

  const handleProfileClick = () => {
    if (user?.role === 'READER') {
      router.push('/reader-profile')
    } else if (user?.role === 'WRITER') {
      router.push('/writer-profile')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
              BlogSpace
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <input
                type="search"
                placeholder="Search posts..."
                className="w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
              />
              <FiSearch className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            
            {user?.isLoggedIn ? (
              <>
                {user.role === 'WRITER' && (
                  <Link
                    href="/blogs/write"
                    className="hidden md:flex items-center space-x-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                  >
                    <FiEdit className="h-4 w-4" />
                    <span>Write</span>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium transition hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span>{user.name}</span>
                    <svg className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-900 py-2 shadow-lg ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                      >
                        <FiUser className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
              >
                <FiUser className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-3 px-4 py-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search posts..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
                />
                <FiSearch className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {user?.isLoggedIn ? (
                <>
                  {user.role === 'WRITER' && (
                    <Link
                      href="/blogs/write"
                      className="flex items-center space-x-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                    >
                      <FiEdit className="h-4 w-4" />
                      <span>Write</span>
                    </Link>
                  )}
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-full"
                  >
                    <FiUser className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center space-x-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  <FiUser className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
