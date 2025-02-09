'use client'
import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FiX } from 'react-icons/fi'
import Editor from '@/components/Editor'
import { motion } from 'framer-motion'

interface Post {
  id: string
  title: string
  content: string
  image: string | null
  category: string
  tags: string[]
  published: boolean
}

interface EditModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function EditModal({ post, isOpen, onClose, onUpdate }: EditModalProps) {
  const [editedPost, setEditedPost] = useState({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    tags: post.tags,
    published: post.published,
    image: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    
    Object.entries(editedPost).forEach(([key, value]) => {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(value))
      } else if (value !== null) {
        if (typeof value === 'string' || value instanceof Blob) {
          formData.append(key, value)
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        }
      }
    })

    const token = localStorage.getItem('token')
    const res = await fetch(`/api/blogs/${post.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (res.ok) {
      onUpdate()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              className="w-full text-2xl font-bold p-2 border-none focus:ring-2 focus:ring-primary rounded-lg bg-transparent"
              placeholder="Post Title"
            />
            
            <Editor
              value={editedPost.content}
              onChange={(content) => setEditedPost({ ...editedPost, content })}
              onImageUpload={(file) => setEditedPost({ ...editedPost, image: file })}
              onCategoryChange={(category) => setEditedPost({ ...editedPost, category })}
              onTagsChange={(tags) => setEditedPost({ ...editedPost, tags })}
            />

            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editedPost.published}
                  onChange={(e) => setEditedPost({ ...editedPost, published: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Published</span>
              </label>

              <div className="flex gap-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </Dialog>
  )
}
