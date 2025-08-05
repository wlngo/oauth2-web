import { useNavigate } from '@tanstack/react-router'
import { getUserInfo, type UserInfo } from "@/routes/auth"
import { useState, useEffect } from "react"

export default function Profile() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true)
      setError("")
      try {
        const info = await getUserInfo()
        if (info) {
          setUserInfo(info)
        } else {
          setError("无法获取用户信息")
        }
      } catch (err: any) {
        setError(err.message || "获取用户信息失败")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const handleBackToHome = () => {
    navigate({ to: "/" })
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">👤 用户信息</h1>
          <button
            onClick={handleBackToHome}
            className="text-blue-500 underline"
          >
            返回首页
          </button>
        </div>
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">👤 用户信息</h1>
          <button
            onClick={handleBackToHome}
            className="text-blue-500 underline"
          >
            返回首页
          </button>
        </div>
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">👤 用户信息</h1>
        <button
          onClick={handleBackToHome}
          className="text-blue-500 underline"
        >
          返回首页
        </button>
      </div>

      {userInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid gap-4">
            {userInfo.id && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">ID:</span>
                <span className="text-gray-900">{userInfo.id}</span>
              </div>
            )}
            
            {userInfo.username && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">用户名:</span>
                <span className="text-gray-900">{userInfo.username}</span>
              </div>
            )}
            
            {userInfo.name && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">姓名:</span>
                <span className="text-gray-900">{userInfo.name}</span>
              </div>
            )}
            
            {userInfo.email && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">邮箱:</span>
                <span className="text-gray-900">{userInfo.email}</span>
              </div>
            )}
            
            {userInfo.roles && userInfo.roles.length > 0 && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">角色:</span>
                <span className="text-gray-900">{userInfo.roles.join(', ')}</span>
              </div>
            )}
            
            {userInfo.createdAt && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">创建时间:</span>
                <span className="text-gray-900">{new Date(userInfo.createdAt).toLocaleString('zh-CN')}</span>
              </div>
            )}
            
            {userInfo.lastLoginAt && (
              <div className="flex">
                <span className="font-semibold text-gray-700 w-24">最后登录:</span>
                <span className="text-gray-900">{new Date(userInfo.lastLoginAt).toLocaleString('zh-CN')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}