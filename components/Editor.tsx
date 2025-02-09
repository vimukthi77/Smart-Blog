'use client'
import { useState } from 'react'
import Image from 'next/image'
import { FiUpload, FiX, FiTag, FiFolder } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Business']
const availableTags = ['JavaScript', 'React', 'Node.js', 'Python', 'Design', 'Tutorial']

interface EditorProps {
  value: string
  onChange: (content: string) => void
  onImageUpload: (file: File) => void
  onCategoryChange: (category: string) => void
  onTagsChange: (tags: string[]) => void
}

const Editor = ({ value, onChange, onImageUpload, onCategoryChange, onTagsChange }: EditorProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageFile(file)
    }
  }

  const handleImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onImageUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file)
    }
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    setSelectedTags(newTags)
    onTagsChange(newTags)
  }

  return (
    <div className="space-y-6">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors
          ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-700'}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop an image, or click to select
          </p>
        </div>
        
        <AnimatePresence>
          {imagePreview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative mt-4 h-48 w-full"
            >
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => setImagePreview('')}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              >
                <FiX className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium gap-2">
            <FiFolder className="h-4 w-4" />
            Category
          </label>
          <select
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium gap-2">
            <FiTag className="h-4 w-4" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[400px] p-4 border rounded-lg bg-transparent resize-none focus:ring-2 focus:ring-primary"
        placeholder="Write your blog content..."
      />
    </div>
  )
}

export default Editor
