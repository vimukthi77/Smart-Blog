'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Editor from '@/components/Editor'

export default function WriteBlogPage() {
  const router = useRouter()
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    image: null as File | null,
    published: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('title', blogData.title)
    formData.append('content', blogData.content)
    formData.append('category', blogData.category)
    formData.append('tags', JSON.stringify(blogData.tags))
    if (blogData.image) {
      formData.append('image', blogData.image)
    }
    formData.append('published', String(blogData.published))

    const token = localStorage.getItem('token')
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (res.ok) {
      router.push('/writer-profile')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <input
        type="text"
        value={blogData.title}
        onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
        placeholder="Blog Title"
        className="w-full bg-background text-3xl font-bold mb-6 p-2 border rounded"
      />
      
      <Editor
        value={blogData.content}
        onChange={(content) => setBlogData({ ...blogData, content })}
        onImageUpload={(file) => setBlogData({ ...blogData, image: file })}
        onCategoryChange={(category) => setBlogData({ ...blogData, category })}
        onTagsChange={(tags) => setBlogData({ ...blogData, tags })}
      />

      <button type="submit" className="mt-6 px-6 py-2 bg-primary text-white rounded-lg">
        Publish
      </button>
    </form>
  )
}
