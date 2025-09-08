import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Common scopes options for quick selection
const COMMON_SCOPES = [
    { value: 'openid', label: 'OpenID Connect', description: '基础身份验证信息' },
    { value: 'profile', label: '用户基本信息', description: '用户的基本档案信息' },
    { value: 'email', label: '邮箱地址', description: '用户的邮箱地址' },
    { value: 'address', label: '地址信息', description: '用户的地址信息' },
    { value: 'phone', label: '电话号码', description: '用户的电话号码' },
    { value: 'read', label: '读取权限', description: '读取数据的权限' },
    { value: 'write', label: '写入权限', description: '写入数据的权限' },
    { value: 'message.read', label: '消息读取', description: '读取消息的权限' },
    { value: 'message.write', label: '消息写入', description: '写入消息的权限' }
]

export default function OAuth2ScopeTest() {
    const [scopes, setScopes] = useState<string[]>(['read', 'write'])
    const [scopeInput, setScopeInput] = useState('')

    const handleScopeToggle = (scope: string) => {
        setScopes(prev => 
            prev.includes(scope)
                ? prev.filter(s => s !== scope)
                : [...prev, scope]
        )
    }

    const handleAddScope = () => {
        if (scopeInput.trim() && !scopes.includes(scopeInput.trim())) {
            setScopes(prev => [...prev, scopeInput.trim()])
            setScopeInput('')
        }
    }

    const handleRemoveScope = (scope: string) => {
        setScopes(prev => prev.filter(s => s !== scope))
    }

    const handleScopeInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddScope()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>OAuth2 权限范围管理 - 新功能演示</CardTitle>
                        <p className="text-gray-600">演示新的灵活权限范围管理功能</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Enhanced Scopes Section */}
                        <div>
                            <label className="block text-sm font-medium mb-3">权限范围 *</label>
                            
                            {/* Current selected scopes */}
                            {scopes.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-sm text-gray-600 mb-2">已选择的权限范围:</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {scopes.map((scope) => (
                                            <Badge
                                                key={scope}
                                                variant="outline"
                                                className="text-xs px-2 py-1 cursor-pointer hover:bg-red-50 hover:border-red-300"
                                                onClick={() => handleRemoveScope(scope)}
                                            >
                                                {scope}
                                                <span className="ml-1 text-red-500">×</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add custom scope */}
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="输入自定义权限范围 (例如: custom.read, api.access)"
                                        value={scopeInput}
                                        onChange={(e) => setScopeInput(e.target.value)}
                                        onKeyPress={handleScopeInputKeyPress}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddScope}
                                        disabled={!scopeInput.trim() || scopes.includes(scopeInput.trim())}
                                        size="sm"
                                        variant="outline"
                                    >
                                        添加
                                    </Button>
                                </div>
                                
                                {/* Quick select common scopes */}
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">常用权限范围:</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {COMMON_SCOPES.map(option => (
                                            <Button
                                                key={option.value}
                                                type="button"
                                                size="sm"
                                                variant={scopes.includes(option.value) ? "default" : "outline"}
                                                onClick={() => handleScopeToggle(option.value)}
                                                className="text-xs"
                                                disabled={scopes.includes(option.value)}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demo Result */}
                        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                            <h4 className="font-medium mb-2">当前权限范围 (以逗号分隔的字符串形式):</h4>
                            <code className="text-sm">{scopes.join(',')}</code>
                        </div>

                        {/* Comparison */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-green-600 mb-2">✅ 新功能优势:</h4>
                                <ul className="text-sm space-y-1">
                                    <li>• 支持自定义权限范围</li>
                                    <li>• 灵活输入任意值</li>
                                    <li>• 保留常用权限快速选择</li>
                                    <li>• 直观的添加/删除操作</li>
                                    <li>• 支持键盘快捷操作 (Enter)</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-orange-600 mb-2">⚠️ 原有限制:</h4>
                                <ul className="text-sm space-y-1">
                                    <li>• 只能选择预定义范围</li>
                                    <li>• 无法添加自定义权限</li>
                                    <li>• 固定的枚举选项</li>
                                    <li>• 不够灵活</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}