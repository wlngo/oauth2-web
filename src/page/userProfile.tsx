import {useState, useEffect} from "react"
import {useNavigate} from '@tanstack/react-router'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {getRequest} from "@/lib/http"
import {User, Mail, Calendar, Shield, ArrowLeft, Settings} from "lucide-react"

interface UserInfo {
    id?: string
    username?: string
    email?: string
    fullName?: string
    avatar?: string
    roles?: string[]
    authorities?: string[]
    createdAt?: string
    lastLoginAt?: string
    profile?: {
        firstName?: string
        lastName?: string
        phoneNumber?: string
        department?: string
        jobTitle?: string
    }
}

export default function UserProfile() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchUserInfo()
    }, [])

    const fetchUserInfo = async () => {
        try {
            setLoading(true)
            const response = await getRequest('/api/auth/me', {}, {
                csrf: true,
                csrfUseCache: false
            })
            setUserInfo((response as UserInfo) || null)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "获取用户信息失败")
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2)
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "未知"
        try {
            return new Date(dateString).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载用户信息中...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={() => navigate({to: "/"})} variant="outline">
                                返回首页
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => navigate({to: "/"})}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4"/>
                            返回首页
                        </Button>
                        <h1 className="text-xl font-semibold">用户资料</h1>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2"/>
                            编辑资料
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid gap-6">
                    {/* Profile Overview Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={userInfo?.avatar}
                                        alt={userInfo?.fullName || userInfo?.username}
                                    />
                                    <AvatarFallback
                                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                                        {getInitials(userInfo?.fullName || userInfo?.username)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {userInfo?.fullName || userInfo?.profile?.firstName + " " + userInfo?.profile?.lastName || userInfo?.username || "用户"}
                                        </h2>
                                        {userInfo?.profile?.jobTitle && (
                                            <p className="text-gray-600">{userInfo.profile.jobTitle}</p>
                                        )}
                                        {userInfo?.profile?.department && (
                                            <p className="text-sm text-gray-500">{userInfo.profile.department}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {userInfo?.roles?.map((role, index) => (
                                            <Badge key={index} variant="secondary">
                                                {role}
                                            </Badge>
                                        ))}
                                        {userInfo?.authorities?.map((auth, index) => (
                                            <Badge key={index} variant="outline">
                                                {auth}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5"/>
                                    基本信息
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">用户名</label>
                                        <p className="text-gray-900">{userInfo?.username || "未设置"}</p>
                                    </div>

                                    <Separator/>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">用户ID</label>
                                        <p className="text-gray-900 font-mono text-sm">{userInfo?.id || "未知"}</p>
                                    </div>

                                    {userInfo?.profile?.phoneNumber && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">手机号码</label>
                                                <p className="text-gray-900">{userInfo.profile.phoneNumber}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5"/>
                                    联系信息
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">邮箱地址</label>
                                        <p className="text-gray-900">{userInfo?.email || "未设置"}</p>
                                    </div>

                                    {(userInfo?.profile?.firstName || userInfo?.profile?.lastName) && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">姓名</label>
                                                <p className="text-gray-900">
                                                    {[userInfo?.profile?.firstName, userInfo?.profile?.lastName].filter(Boolean).join(" ") || "未设置"}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5"/>
                                    安全信息
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">账户角色</label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {userInfo?.roles?.length ? (
                                                userInfo.roles.map((role, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {role}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">无角色信息</span>
                                            )}
                                        </div>
                                    </div>

                                    {userInfo?.authorities?.length && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">权限列表</label>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {userInfo.authorities.map((auth, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {auth}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5"/>
                                    账户活动
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">账户创建时间</label>
                                        <p className="text-gray-900">{formatDate(userInfo?.createdAt)}</p>
                                    </div>

                                    <Separator/>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">最后登录时间</label>
                                        <p className="text-gray-900">{formatDate(userInfo?.lastLoginAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}