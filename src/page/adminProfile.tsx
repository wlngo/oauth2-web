import {useState, useEffect} from "react"
import {useNavigate} from '@tanstack/react-router'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {request} from "@/lib/http"
import {User, Mail, Calendar, Shield, ArrowLeft, Settings, UserCog} from "lucide-react"

interface UserInfo {
    userId?: string
    username?: string
    password?: string
    nickName?: string
    realName?: string
    email?: string
    emailVerified?: boolean
    phoneNumber?: string
    phoneNumberVerified?: boolean
    gender?: number
    birthdate?: string
    avatarUrl?: string
    createdAt?: string
    updatedAt?: string
    authorities?: string[]
}

export default function AdminProfile() {
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
            const response = await request('/api/auth/userinfo', {
                method: 'POST',
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
        if (!name) return "A"
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

    const getGenderText = (gender?: number) => {
        switch (gender) {
            case 0: return "女"
            case 1: return "男"
            case 2: return "其他"
            default: return "未设置"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载管理员信息中...</p>
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
                            <Button onClick={() => navigate({to: "/admin"})} variant="outline">
                                返回管理后台
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
                            onClick={() => navigate({to: "/admin"})}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4"/>
                            返回管理后台
                        </Button>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600"/>
                            <h1 className="text-xl font-semibold">管理员资料</h1>
                        </div>
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
                    {/* Admin Profile Overview Card */}
                    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <Avatar className="h-24 w-24 ring-4 ring-blue-200">
                                    <AvatarImage
                                        src={userInfo?.avatarUrl}
                                        alt={userInfo?.nickName || userInfo?.username}
                                    />
                                    <AvatarFallback
                                        className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-xl font-semibold">
                                        {getInitials(userInfo?.nickName || userInfo?.realName || userInfo?.username)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <UserCog className="h-5 w-5 text-blue-600"/>
                                            <span className="text-sm font-medium text-blue-600">管理员账户</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {userInfo?.nickName || userInfo?.realName || userInfo?.username || "管理员"}
                                        </h2>
                                        <p className="text-gray-600">管理员ID: {userInfo?.userId}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {userInfo?.authorities?.map((auth, index) => (
                                            <Badge key={index} variant="default" className="bg-blue-600">
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
                                        <label className="text-sm font-medium text-gray-500">昵称</label>
                                        <p className="text-gray-900">{userInfo?.nickName || "未设置"}</p>
                                    </div>

                                    {userInfo?.realName && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">真实姓名</label>
                                                <p className="text-gray-900">{userInfo.realName}</p>
                                            </div>
                                        </>
                                    )}

                                    <Separator/>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">性别</label>
                                        <p className="text-gray-900">{getGenderText(userInfo?.gender)}</p>
                                    </div>

                                    {userInfo?.birthdate && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">生日</label>
                                                <p className="text-gray-900">{formatDate(userInfo.birthdate)}</p>
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
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-900">{userInfo?.email || "未设置"}</p>
                                            {userInfo?.emailVerified && (
                                                <Badge variant="secondary" className="text-xs">已验证</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {userInfo?.phoneNumber && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">手机号码</label>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-gray-900">{userInfo.phoneNumber}</p>
                                                    {userInfo?.phoneNumberVerified && (
                                                        <Badge variant="secondary" className="text-xs">已验证</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Security Information */}
                        <Card className="border-orange-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-orange-600"/>
                                    管理员权限
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">管理员ID</label>
                                        <p className="text-gray-900 font-mono text-sm">{userInfo?.userId || "未知"}</p>
                                    </div>

                                    {userInfo?.authorities?.length && (
                                        <>
                                            <Separator/>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">管理权限</label>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {userInfo.authorities.map((auth, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                                            {auth}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Separator/>
                                    
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <p className="text-sm text-yellow-800">
                                            <Shield className="h-4 w-4 inline mr-1"/>
                                            您正在使用管理员权限访问系统
                                        </p>
                                    </div>
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
                                        <label className="text-sm font-medium text-gray-500">最后更新时间</label>
                                        <p className="text-gray-900">{formatDate(userInfo?.updatedAt)}</p>
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