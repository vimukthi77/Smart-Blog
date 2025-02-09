'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FiHeart, FiMessageSquare, FiClock } from 'react-icons/fi'
import { format } from 'date-fns'

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?postId=${postId}`)
    const data = await res.json()
    setComments(data)
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, postId })
      })

      if (res.ok) {
        setContent('')
        fetchComments()
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="min-h-[100px] p-4 text-base resize-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full transition-all"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <AnimatePresence>
        <div className="space-y-6">
          {comments.map((comment: any) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.image} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {comment.user.name}
                    </h3>
                    <span className="text-sm text-gray-500 flex items-center">
                      <FiClock className="mr-1" />
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                  <div className="flex items-center space-x-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                      <FiHeart className="mr-1" />
                      {comment._count?.likes || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary">
                      <FiMessageSquare className="mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {comments.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
