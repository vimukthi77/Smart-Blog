'use client'
import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const userInfo = JSON.parse(window.atob(base64))
        setUser(userInfo)
      } catch (error) {
        console.log('Token parsing error')
      }
    }
  }, [])

  return { user }
}
