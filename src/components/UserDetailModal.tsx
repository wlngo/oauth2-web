import { X, Mail, Phone, Calendar, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserInfo } from "@/services/userService"

interface UserDetailModalProps {
  user: UserInfo
  onClose: () => void
  onEdit: (userId: string) => void
}

export function UserDetailModal({ user, onClose, onEdit }: UserDetailModalProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  const getGenderText = (gender?: number) => {
    switch (gender) {
      case 1: return "男"
      case 0: return "女"
      default: return "未知"
    }
  }

  const getRoleDisplay = (authorities?: string[]) => {
    if (!authorities || authorities.length === 0) return "无角色"
    
    const roleMap: Record<string, { label: string; color: string }> = {
      ADMIN: { label: "管理员", color: "bg-red-100 text-red-700" },
      MODERATOR: { label: "版主", color: "bg-blue-100 text-blue-700" },
      USER: { label: "用户", color: "bg-gray-100 text-gray-700" }
    }

    return authorities.map(auth => (
      <Badge 
        key={auth} 
        className={`mr-1 ${roleMap[auth]?.color || "bg-gray-100 text-gray-700"}`}
      >
        {roleMap[auth]?.label || auth}
      </Badge>
    ))
  }

  const getAccountStatus = () => {
    if (user.disabled) return { text: "已禁用", color: "text-red-600" }
    if (user.accountLocked) return { text: "已锁定", color: "text-orange-600" }
    if (user.accountExpired) return { text: "已过期", color: "text-yellow-600" }
    if (user.credentialsExpired) return { text: "凭据过期", color: "text-yellow-600" }
    return { text: "正常", color: "text-green-600" }
  }

  const accountStatus = getAccountStatus()

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">用户详情</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>
                {user.nickName?.charAt(0) || user.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.nickName || user.username}</h3>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">状态:</span>
                <span className={`text-sm font-medium ${accountStatus.color}`}>
                  {accountStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 border-b pb-2">基本信息</h4>
              
              <div>
                <label className="text-sm text-gray-500">用户ID</label>
                <p className="text-gray-900">{user.userId || "-"}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">真实姓名</label>
                <p className="text-gray-900">{user.realName || "-"}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">性别</label>
                <p className="text-gray-900">{getGenderText(user.gender)}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">出生日期</label>
                <p className="text-gray-900">{formatDate(user.birthdate)}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 border-b pb-2">联系信息</h4>
              
              {/* Email */}
              <div>
                <label className="text-sm text-gray-500">邮箱</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{user.email || "-"}</span>
                  {user.email && (
                    user.emailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )
                  )}
                </div>
                {user.email && (
                  <p className="text-xs text-gray-500 ml-6">
                    {user.emailVerified ? "已验证" : "未验证"}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-500">手机号</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{user.phoneNumber || "-"}</span>
                  {user.phoneNumber && (
                    user.phoneNumberVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )
                  )}
                </div>
                {user.phoneNumber && (
                  <p className="text-xs text-gray-500 ml-6">
                    {user.phoneNumberVerified ? "已验证" : "未验证"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Roles */}
          <div>
            <h4 className="font-medium text-gray-900 border-b pb-2 mb-3">角色权限</h4>
            <div className="flex flex-wrap gap-1">
              {getRoleDisplay(user.authorities)}
            </div>
          </div>

          {/* Account Status Details */}
          <div>
            <h4 className="font-medium text-gray-900 border-b pb-2 mb-3">账户状态</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>账户禁用:</span>
                <span className={user.disabled ? "text-red-600" : "text-green-600"}>
                  {user.disabled ? "是" : "否"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>账户锁定:</span>
                <span className={user.accountLocked ? "text-red-600" : "text-green-600"}>
                  {user.accountLocked ? "是" : "否"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>账户过期:</span>
                <span className={user.accountExpired ? "text-red-600" : "text-green-600"}>
                  {user.accountExpired ? "是" : "否"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>凭据过期:</span>
                <span className={user.credentialsExpired ? "text-red-600" : "text-green-600"}>
                  {user.credentialsExpired ? "是" : "否"}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h4 className="font-medium text-gray-900 border-b pb-2 mb-3">时间信息</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">创建时间:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">更新时间:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-6 border-t">
          <Button onClick={() => onEdit(user.userId!)} className="flex-1">
            编辑用户
          </Button>
        </div>
      </div>
    </div>
  )
}