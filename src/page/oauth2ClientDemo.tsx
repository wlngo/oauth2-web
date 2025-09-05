import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Settings
} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"

// Mock data for demonstration
const mockClients = [
    {
        id: "1945411626979069953",
        clientId: "oidc-client",
        clientName: "开发环境客户端",
        authorizationGrantTypes: "refresh_token,client_credentials,authorization_code",
        scopes: "address,openid,profile,message.read,email,message.write",
        clientIdIssuedAt: 1752657250
    },
    {
        id: "1945411626979069954",
        clientId: "web-app-client",
        clientName: "Web应用客户端",
        authorizationGrantTypes: "authorization_code,refresh_token",
        scopes: "read,write,openid,profile",
        clientIdIssuedAt: 1752657300
    },
    {
        id: "1945411626979069955",
        clientId: "mobile-app-client",
        clientName: "移动应用客户端",
        authorizationGrantTypes: "authorization_code,refresh_token,client_credentials",
        scopes: "read,write,push_notifications",
        clientIdIssuedAt: 1752657350
    }
]

export default function OAuth2ClientManagementDemo() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">OAuth2 客户端管理</h1>
                        <p className="text-gray-600 mt-1">管理 OAuth2 认证客户端 - 演示界面</p>
                    </div>
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        新建客户端
                    </Button>
                </div>

                {/* Search Bar */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="搜索客户端 ID 或名称..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Clients Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            OAuth2 客户端列表
                            <span className="text-sm font-normal text-gray-500">
                                (共 {mockClients.length} 个客户端)
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table */}
                        <div className="hidden lg:block">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>客户端 ID</TableHead>
                                    <TableHead>客户端名称</TableHead>
                                    <TableHead>授权类型</TableHead>
                                    <TableHead>权限范围</TableHead>
                                    <TableHead>创建时间</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-mono text-sm">
                                            {client.clientId}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {client.clientName}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {client.authorizationGrantTypes.split(',').slice(0, 2).map((type, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {type.trim()}
                                                    </Badge>
                                                ))}
                                                {client.authorizationGrantTypes.split(',').length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{client.authorizationGrantTypes.split(',').length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {client.scopes.split(',').slice(0, 3).map((scope, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {scope.trim()}
                                                    </Badge>
                                                ))}
                                                {client.scopes.split(',').length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{client.scopes.split(',').length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(client.clientIdIssuedAt * 1000).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4 mt-6">
                            {mockClients.map((client) => (
                                <Card key={client.id} className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
                                    <div className="space-y-4">
                                        {/* Client Header */}
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                <Settings className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{client.clientName}</div>
                                                <div className="text-sm text-muted-foreground font-mono truncate">{client.clientId}</div>
                                            </div>
                                        </div>

                                        {/* Grant Types */}
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">授权类型:</div>
                                            <div className="flex gap-1 flex-wrap">
                                                {client.authorizationGrantTypes.split(',').map((type, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {type.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Scopes */}
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">权限范围:</div>
                                            <div className="flex gap-1 flex-wrap">
                                                {client.scopes.split(',').map((scope, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {scope.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Creation Date */}
                                        <div className="text-sm text-muted-foreground">
                                            创建时间: {new Date(client.clientIdIssuedAt * 1000).toLocaleDateString()}
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-2 pt-2 border-t bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 backdrop-blur-sm rounded-lg p-3 -mx-1">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                查看
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-500 hover:border-green-600 shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                编辑
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                删除
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Demo Form Preview */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">客户端表单示例</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div><strong>客户端 ID:</strong> 系统自动生成或手动输入</div>
                                    <div><strong>客户端名称:</strong> 应用程序显示名称</div>
                                    <div><strong>客户端密钥:</strong> 安全认证密钥</div>
                                    <div><strong>认证方式:</strong> client_secret_basic, client_secret_post</div>
                                </div>
                                <div className="space-y-2">
                                    <div><strong>授权类型:</strong> authorization_code, refresh_token, client_credentials</div>
                                    <div><strong>重定向 URI:</strong> 授权完成后的回调地址</div>
                                    <div><strong>权限范围:</strong> 客户端可访问的资源权限</div>
                                    <div><strong>设置选项:</strong> JSON 格式的客户端和令牌配置</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}