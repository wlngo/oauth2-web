// src/pages/Home.tsx
import { Link } from '@tanstack/react-router'

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🏠 Home</h1>
      <Link to="/login" className="text-blue-500 underline">Go to Login</Link>
    </div>
  )
}
