'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight } from 'react-icons/fi'

export default function ThankYouPage() {
  const navigate = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.push('/dashboard')
    }, 5000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-8"
        >
          <FiCheck className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4">Post Published!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Your blog post has been successfully published.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate.push('/blogs')}
            className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <span>Go to Blogs page</span>
            <FiArrowRight />
          </button>
          
          <p className="text-sm text-gray-500">
            You will be redirected automatically in 5 seconds
          </p>
        </div>
      </motion.div>
    </div>
  )
}
