'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BlogCard from '@/components/BlogCard'
import { EditModal } from '@/components/EditModal'
import { DeleteAlert } from '@/components/DeleteAlert'
import { Button } from '@/components/ui/button'
import BlogCardSkeleton from '@/components/BlogCardSkeleton'

interface Post {
  id: string
  title: string
  content: string
  image: string | null
  category: string
  tags: string[]
  published: boolean
  author: {
    name: string
    email: string
  }
}

export default function BlogsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.API_URL}/api/blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        // Ensure posts is an array
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (post: Post) => {
    setSelectedPost(post)
    setIsEditModalOpen(true)
  }

  const handleDelete = (post: Post) => {
    setSelectedPost(post)
    setIsDeleteAlertOpen(true)
  }

  const handleViewPost = (postId: string) => {
    router.push(`/blog/${postId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(null).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))
          ) : (
            posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={() => handleViewPost(post.id)} 
                onEdit={function (): void {
                  throw new Error('Function not implemented.')
                } } onDelete={function (): void {
                  throw new Error('Function not implemented.')
                } }              />
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
