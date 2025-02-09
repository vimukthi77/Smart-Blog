
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-background h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to Our Blog
            </h1>
            <p className="text-xl mb-8">
              Discover stories, insights, and inspiration
            </p>
            <Link href="/blogs">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300">
                Start Reading
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((post) => (
              <motion.div
                key={post}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={`/blog-${post}.jpg`}
                    alt={`Blog post ${post}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Featured Article {post}</h3>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Read More →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Technology', 'Lifestyle', 'Travel', 'Food'].map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <p className="text-gray-600">20+ articles</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Subscribe to Our Newsletter</h2>
            <p className="text-xl mb-8">
              Get the latest posts and updates delivered straight to your inbox.
            </p>
            <form className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white flex-1 max-w-md"
              />
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((post) => (
              <motion.article
                key={post}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={`/post-${post}.jpg`}
                    alt={`Post ${post}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-blue-600 text-sm font-semibold">Category</span>
                  <h3 className="text-lg font-semibold mt-2 mb-2">Blog Post Title {post}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Short description of the blog post goes here...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">5 min read</span>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Read More →
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
