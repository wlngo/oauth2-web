import { useNavigate } from '@tanstack/react-router'
import { request } from "@/lib/http"
import { useState } from "react"

export default function Home() {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const handleLogout = async () => {
    setError("")
    try {
      const res = await request("/logout", {
        method: "POST",
        csrf: true,
        csrfUseCache: true,
      });

      if (res.code == 200) {
        navigate({ to: "/login" })
      } else {
        setError(res.msg || "登出失败")
      }

    } catch (err: any) {
      setError(err.message || "登出请求异常")
    }
  }

  return (
    <div className="p-8 space-y-4 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🏠 Home</h1>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="text-blue-500 underline"
          >
            用户信息
          </button>
          <button
            onClick={handleLogout}
            className="text-blue-500 underline"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
}
