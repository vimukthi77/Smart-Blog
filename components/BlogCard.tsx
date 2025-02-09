'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiTag, FiFolder, FiEdit, FiTrash, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '@/hooks/useAuth' // Create this custom hook
import { useState, useEffect } from 'react'

interface Post {
  id: string
  title: string
  content: string
  image: string | null | undefined
  category: string
  tags: string[]
  published: boolean
  author: {
    name: string
    email: string
  }
}

interface BlogCardProps {
    post: Post
    onClick: () => void
    onEdit: () => void
    onDelete: () => void
}

export default function BlogCard({ post, onClick, onEdit, onDelete }: BlogCardProps) {
    const [userRole, setUserRole] = useState<string | null>(null)

    useEffect(() => {
      const role = localStorage.getItem('userRole')
      setUserRole(role)
    }, [])
  
    const canEditDelete = userRole === 'WRITER' || userRole === 'ADMIN'
  
  return (
    <motion.div
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Action buttons - Only visible for writers */}
      {canEditDelete && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-primary/90 hover:text-white transition-all"
            aria-label="Edit post"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-red-500/90 hover:text-white transition-all"
            aria-label="Delete post"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* Rest of your existing BlogCard content */}
      <div onClick={onClick}>
        {post.image && (
          <div className="relative h-48 w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.content}
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            <FiFolder className="text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.category}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
              >
                <FiTag className="inline-block mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
