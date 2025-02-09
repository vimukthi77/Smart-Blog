import { Suspense } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { FiClock, FiUser, FiTag, FiFolder } from 'react-icons/fi'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CommentSection from '@/components/CommentSection'

async function getBlogPost(slug: string) {
  const res = await fetch(`${process.env.API_URL}/api/view-blogs/${slug}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!res.ok) return null
  return res.json()
}

export async function generateStaticParams() {
  const posts = await fetch(`${process.env.API_URL}/api/blogs`).then(res => res.json())
  return posts.map((post: any) => ({
    slug: post.id
  }))
}

export default async function BlogPost({ params }: { params: { id: string } }) {
    const post = await getBlogPost(params.id)
  
  if (!post) {
    notFound()
  }


  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative h-[60vh] rounded-2xl overflow-hidden mb-8">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8">
            <div className="flex items-center gap-4 text-white/80 mb-4">
              <span className="flex items-center gap-2">
                <FiClock className="h-4 w-4" />
                {format(new Date(post.createdAt), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-2">
                <FiFolder className="h-4 w-4" />
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={post.author.image} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-white/80">{post.author.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  <FiTag className="inline-block mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Main Content */}
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Comments Section */}
            <Suspense>
              <CommentSection postId={post.id} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-8">
              {/* Author Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={post.author.image} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold mb-2">{post.author.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.author.bio}
                </p>
                <div className="flex gap-4">
                  {/* Add social media links here */}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
