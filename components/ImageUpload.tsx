'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function ImageUpload({ onImageUpload }: { onImageUpload: (file: File) => void }) {
  const [preview, setPreview] = useState<string>('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-gray-700">Cover Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
      </label>
      {preview && (
        <div className="relative h-48 w-full">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  )
}
