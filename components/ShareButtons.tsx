'use client'
import { motion } from 'framer-motion'
import { FiTwitter, FiFacebook, FiLinkedin, FiLink } from 'react-icons/fi'

interface ShareButtonsProps {
  post: {
    title: string
    id: string
  }
}

export default function ShareButtons({ post }: ShareButtonsProps) {
  const url = `${window.location.origin}/blog/${post.id}`

  const shareLinks = [
    {
      icon: FiTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
      color: 'text-blue-400'
    },
    {
      icon: FiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'text-blue-600'
    },
    {
      icon: FiLinkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(post.title)}`,
      color: 'text-blue-700'
    }
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    // Add toast notification here
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <h3 className="text-lg font-semibold">Share this post</h3>
      <div className="flex gap-4">
        {shareLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${link.color} hover:opacity-80 p-2 rounded-full bg-gray-100 dark:bg-gray-800`}
          >
            <link.icon className="h-5 w-5" />
          </motion.a>
        ))}
        <motion.button
          onClick={copyLink}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-600 dark:text-gray-300 hover:opacity-80 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <FiLink className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )
}
