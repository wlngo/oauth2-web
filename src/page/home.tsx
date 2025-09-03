import {useNavigate} from '@tanstack/react-router'
import {request} from "@/lib/http"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {User, LogOut, House, Shield} from "lucide-react"
import UserMenuCards from "@/components/UserMenuCards"

interface LogoutResponse {
    code: number
    msg?: string
}

export default function Home() {
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const handleLogout = async () => {
        setError("")
        try {
            const res = await request<LogoutResponse>("/logout", {
                method: "POST",
                csrf: true,
                csrfUseCache: false,
            });

            if (res.code == 200) {
                navigate({to: "/login"})
            } else {
                setError(res.msg || "登出失败")
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "登出请求异常")
        }
    }

    const goToProfile = () => {
        navigate({to: "/profile"})
    }

    const goToAdmin = () => {
        navigate({to: "/admin"})
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <House className="h-6 w-6 text-blue-600"/>
                            <h1 className="text-xl font-semibold">OAuth2 应用</h1>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4"/>
                            登出账户
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid gap-6">
                    {/* Welcome Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">欢迎回来！</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-6">
                                您已成功登录。您可以查看您的个人资料信息或管理您的账户设置。
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={goToProfile}
                                    className="flex items-center gap-2"
                                >
                                    <User className="h-4 w-4"/>
                                    查看个人资料
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Menu Cards - Dynamic based on user permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>我的应用</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserMenuCards />
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={goToProfile}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="h-6 w-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">个人资料</h3>
                                        <p className="text-sm text-gray-600">查看和管理您的个人信息</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={goToAdmin}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Shield className="h-6 w-6 text-purple-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">管理后台</h3>
                                        <p className="text-sm text-gray-600">系统管理和配置</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <House className="h-6 w-6 text-green-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">系统状态</h3>
                                        <p className="text-sm text-gray-600">一切运行正常</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {error && (
                        <Card className="border-red-200">
                            <CardContent className="pt-6">
                                <div className="text-red-600">{error}</div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
