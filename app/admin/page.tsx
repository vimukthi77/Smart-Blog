'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiEdit2, FiTrash2, FiUser, FiUserCheck, FiUserX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import BlogCard from '@/components/BlogCard'
import { EditModal } from '@/components/EditModal'
import { DeleteAlert } from '@/components/DeleteAlert'
import BlogCardSkeleton from '@/components/BlogCardSkeleton'

interface User {
  id: string
  name: string
  email: string
  role: string
}

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

export default function AdminDashboard() {
  const navigate = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const router = useRouter()
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
        const res = await fetch('/api/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
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
  
    const deletePost = async (postId: string) => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/blogs/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          setPosts(posts.filter(post => post.id !== postId))
        }
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            setUsers(data)
            console.log(data) // To verify the data
          } catch (error) {
            console.log('Error fetching users:', error)
          }
        }
      
        fetchUsers()
      }, [])
      
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')
    if (!token || token !== 'admin-token' || role !== 'ADMIN') {
        navigate.replace('/auth')
      return
    }
    fetchPosts()
  }, [navigate])


  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })

      if (res.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                      >
                        <div className="flex justify-between items-center mb-8">
                          <Button
                            onClick={() => router.push('/blogs/write')}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Write New Post
                          </Button>
                        </div>
                
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
                                onEdit={() => handleEdit(post)}
                                onDelete={() => handleDelete(post)} 
                                onClick={function (): void {
                                  throw new Error('Function not implemented.')
                                } }              />
                            ))
                          )}
                        </div>
                      </motion.div>
                
                      {selectedPost && (
                        <>
                          <EditModal
                            isOpen={isEditModalOpen}
                            post={selectedPost}
                            onClose={() => {
                              setIsEditModalOpen(false)
                              setSelectedPost(null)
                            }}
                            onUpdate={fetchPosts}
                          />
                
                          <DeleteAlert
                            isOpen={isDeleteAlertOpen}
                            onClose={() => {
                              setIsDeleteAlertOpen(false)
                              setSelectedPost(null)
                            }}
                            onConfirm={async () => {
                              if (selectedPost) {
                                await deletePost(selectedPost.id)
                                setIsDeleteAlertOpen(false)
                                setSelectedPost(null)
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {users.map(user => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                          >
                            <option value="READER">Reader</option>
                            <option value="WRITER">Writer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
