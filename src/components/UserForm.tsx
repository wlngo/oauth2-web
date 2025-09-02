import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { CreateUserRequest, UpdateUserRequest, UserInfo } from "@/services/userService"

interface UserFormProps {
  user?: UserInfo // If provided, it's edit mode
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEditMode = !!user
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    nickName: user?.nickName || "",
    realName: user?.realName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender ?? -1,
    birthdate: user?.birthdate || "",
    avatarUrl: user?.avatarUrl || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空"
    }

    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = "密码不能为空"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确"
    }

    if (formData.phoneNumber && !/^1[3-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "手机号格式不正确"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const submitData = {
        ...formData,
        // Only include password if it's not empty
        ...(formData.password ? { password: formData.password } : {})
      }

      if (isEditMode) {
        await onSubmit({
          userId: user!.userId!,
          ...submitData
        } as UpdateUserRequest)
      } else {
        await onSubmit(submitData as CreateUserRequest)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "编辑用户" : "新增用户"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <Label htmlFor="username">用户名 *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="请输入用户名"
              disabled={isEditMode} // Username shouldn't be editable in edit mode
            />
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">
              密码 {!isEditMode && "*"}
              {isEditMode && <span className="text-gray-500 text-xs ml-1">(留空则不修改)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={isEditMode ? "留空则不修改密码" : "请输入密码"}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Nick Name */}
          <div>
            <Label htmlFor="nickName">昵称</Label>
            <Input
              id="nickName"
              value={formData.nickName}
              onChange={(e) => handleInputChange("nickName", e.target.value)}
              placeholder="请输入昵称"
            />
          </div>

          {/* Real Name */}
          <div>
            <Label htmlFor="realName">真实姓名</Label>
            <Input
              id="realName"
              value={formData.realName}
              onChange={(e) => handleInputChange("realName", e.target.value)}
              placeholder="请输入真实姓名"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="请输入邮箱"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber">手机号</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="请输入手机号"
            />
            {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender">性别</Label>
            <select 
              id="gender"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.gender.toString()} 
              onChange={(e) => handleInputChange("gender", parseInt(e.target.value))}
            >
              <option value="-1">未知</option>
              <option value="0">女</option>
              <option value="1">男</option>
            </select>
          </div>

          {/* Birthdate */}
          <div>
            <Label htmlFor="birthdate">出生日期</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={(e) => handleInputChange("birthdate", e.target.value)}
            />
          </div>

          {/* Avatar URL */}
          <div>
            <Label htmlFor="avatarUrl">头像URL</Label>
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
              placeholder="请输入头像URL"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "提交中..." : (isEditMode ? "更新" : "创建")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}