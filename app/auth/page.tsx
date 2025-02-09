'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const navigate = useRouter()
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'READER'
    })
    const handleSignIn = async () => {
        const result = await signIn('google', {
            redirect: false,
            callbackUrl: '/'
        });
        
        if (result?.ok) {
            router.push('/');
        }
    };
    const handleGitHubSignIn = async () => {
        const result = await signIn('github', {
            redirect: false,
            callbackUrl: '/'
        });
        
        if (result?.ok) {
            router.push('/');
        }
    };
        
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (isLogin) {
            // Special handling for admin login
            if (formData.email === 'admin@gmail.com' && formData.password === '1234') {
                localStorage.setItem('token', 'admin-token')
                localStorage.setItem('userName', 'Admin')
                localStorage.setItem('userRole', 'ADMIN')
                window.dispatchEvent(new Event('storage'))
                console.log('Admin logged in', localStorage.userRole)
                router.push('/admin')
                return
            }
        
            // Regular user login
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
                password: formData.password,
              }),
            })
        
            if (res.ok) {
              const data = await res.json()
              localStorage.setItem('token', data.token)
              localStorage.setItem('userName', data.user.name)
              localStorage.setItem('userRole', data.user.role)
              window.dispatchEvent(new Event('storage'))
              navigate.replace('/')
            }
        } else {
          // Register
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          })
          
          if (res.ok) {
            setIsLogin(true)
          }
        }
      }
      

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Enter your information to create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}          
                placeholder="John Doe"
                className="w-full p-2 rounded-md border border-input bg-background"
              />
            </div>
          )}
          {!isLogin && (
            <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="role">
                Role
                </label>
                <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2 rounded-md border border-input bg-background"
                >
                <option value="READER">Reader</option>
                <option value="WRITER">Writer</option>
                </select>
            </div>
            )}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}            
              placeholder="m@example.com"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-2 rounded-md border border-input bg-background"
              />
            </div>
          )}
          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <Button variant="link" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleSubmit} className="w-full" size="lg">
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={handleSignIn} variant="outline" size="lg">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
              </svg>
              Google
            </Button>
            <Button onClick={handleGitHubSignIn} variant="outline" size="lg">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.271.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="px-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
