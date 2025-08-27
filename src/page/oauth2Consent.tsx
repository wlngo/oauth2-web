// pages/OAuthAuthorizePage.tsx

import {useSearch} from "@tanstack/react-router"
import {useEffect, useState, useRef} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {getRequest} from "@/lib/http"

// === 类型定义 ===

type ScopeItem = {
    registeredClientId: string
    scope: string
    name: string
    description: string
    isVisible: boolean | number
    isDefault: boolean | number
    sortOrder: number
    createdAt: number
    updatedAt: number
}

type OAuthScopeResponse = {
    code: number
    data: {
        authorizationEndpoint: string
        clientId: string
        clientName: string
        state: string
        scopes: ScopeItem[]
        previouslyApprovedScopes: ScopeItem[]
        principalName: string
    }
    msg: string // 移除可选标记，确保 msg 字段存在
}

// === 页面组件 ===

export default function OAuthAuthorizePage() {
    const search = useSearch({strict: false})
    const clientIdParam = search.client_id ?? ""
    const scopeParam = search.scope ?? ""
    const stateParam = search.state ?? ""

    const [oauthData, setOauthData] = useState<OAuthScopeResponse | null>(null)
    const [allScopes, setAllScopes] = useState<ScopeItem[]>([])
    const [scopes, setScopes] = useState<ScopeItem[]>([])
    const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set())
    const [scopesToSubmit, setScopesToSubmit] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const authorizeFormRef = useRef<HTMLFormElement>(null)
    const rejectFormRef = useRef<HTMLFormElement>(null)

    // === 加载权限信息 ===
    useEffect(() => {
        const fetchScopes = async () => {
            setLoading(true)
            setError(null)

            try {
                const res = await getRequest<OAuthScopeResponse>(
                    "/oauth2/consent/scope",
                    {clientId: clientIdParam, scope: scopeParam, state: stateParam},
                    {csrf: false, csrfUseCache: false}
                )

                const oAuthScopeResponse = res as OAuthScopeResponse

                // 标准化布尔值字段
                const normalizedScopes = oAuthScopeResponse.data.scopes.map((s) => ({
                    ...s,
                    isVisible: Boolean(s.isVisible),
                    isDefault: Boolean(s.isDefault),
                }))

                // 过滤出可展示权限并排序
                const visibleScopes = normalizedScopes
                    .filter((s) => s.isVisible)
                    .sort((a, b) => a.sortOrder - b.sortOrder)

                const defaultSelected = new Set(
                    visibleScopes.filter((s) => s.isDefault).map((s) => s.scope)
                )

                // 标准化历史授权项
                const visibleApproved = oAuthScopeResponse.data.previouslyApprovedScopes
                    .map((s) => ({...s, isVisible: Boolean(s.isVisible)}))
                    .filter((s) => s.isVisible)

                setOauthData({
                    ...oAuthScopeResponse,
                    data: {
                        ...oAuthScopeResponse.data,
                        previouslyApprovedScopes: visibleApproved,
                    },
                })
                setAllScopes(normalizedScopes)
                setScopes(visibleScopes)
                setSelectedScopes(defaultSelected)
                setScopesToSubmit(new Set([...defaultSelected])) // 初始提交值
            } catch {
                setError("无法加载权限信息，请稍后再试。")
            } finally {
                setLoading(false)
            }
        }

        fetchScopes()
    }, [clientIdParam, scopeParam, stateParam])

    // === 用户选择权限 ===
    const handleToggleScope = (scopeId: string) => {
        setSelectedScopes((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(scopeId)) {
                newSet.delete(scopeId)
            } else {
                newSet.add(scopeId)
            }
            return newSet
        })
    }

    // === 授权提交 ===
    const handleAuthorize = () => {
        const invisibleScopes = allScopes.filter((s) => !s.isVisible).map((s) => s.scope)
        const toSubmit = new Set([...selectedScopes, ...invisibleScopes])
        setScopesToSubmit(toSubmit)
        setTimeout(() => authorizeFormRef.current?.submit(), 0)
    }

    // === 拒绝授权 ===
    const handleReject = () => rejectFormRef.current?.submit()

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50/40 via-white to-white backdrop-blur-sm">
            <Card
                className="w-full max-w-lg rounded-3xl border border-gray-300 bg-white/95 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <CardHeader className="pb-5 border-b border-gray-300 flex items-center justify-center gap-3">
                    <CardTitle className="text-3xl font-extrabold text-blue-500 tracking-tight flex items-center gap-2">
                        <span>{oauthData?.data.clientName || clientIdParam}</span> 请求访问你的账户
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-14">
                    {/* 已授权权限展示 */}
                    {(oauthData?.data.previouslyApprovedScopes?.length ?? 0) > 0 && (
                        <section>
                            <p className="flex justify-center text-sm text-gray-700 mb-5 font-semibold tracking-wide">
                                你已授权该应用以下权限：
                            </p>
                            <ul className="space-y-4 mb-12">
                                {(oauthData?.data.previouslyApprovedScopes ?? []).map((scope) => (
                                    <li key={scope.scope}
                                        className="flex items-start gap-5 p-3 rounded-lg hover:bg-green-50 transition-colors cursor-default">
                                        <Badge variant="outline"
                                               className="min-w-[90px] mt-1 text-green-700 border-green-700 bg-gradient-to-tr from-green-50 to-white shadow-md">
                                            {scope.scope}
                                        </Badge>
                                        <div>
                                            <p className="text-sm text-green-900 font-semibold">{scope.name}</p>
                                            <p className="mt-1 text-xs text-green-700 leading-relaxed">{scope.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* 新请求权限展示 */}
                    {!loading && !error && scopes.length > 0 && (
                        <section>
                            <p className="flex justify-center text-sm text-gray-700 mb-7 font-semibold tracking-wide">
                                该应用请求以下权限：
                            </p>
                            <ul className="space-y-6" role="list">
                                {scopes.map((scope) => (
                                    <li
                                        key={scope.scope}
                                        className="flex items-center justify-between w-full rounded-lg p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                                        onClick={() => handleToggleScope(scope.scope)}
                                        role="checkbox"
                                        aria-checked={selectedScopes.has(scope.scope)}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === " " || e.key === "Enter") {
                                                e.preventDefault()
                                                handleToggleScope(scope.scope)
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-5 flex-1 pr-4">
                                            <Badge variant="outline"
                                                   className="mt-1 min-w-[90px] text-blue-700 border-blue-700 bg-gradient-to-tr from-blue-50 to-white shadow-md">
                                                {scope.scope}
                                            </Badge>
                                            <div>
                                                <p className="text-sm text-blue-900 font-semibold">{scope.name}</p>
                                                <p className="mt-1 text-xs text-blue-700 leading-relaxed">{scope.description}</p>
                                            </div>
                                        </div>
                                        <label onClick={(e) => e.stopPropagation()}
                                               className="relative flex items-center justify-center w-10 h-10 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedScopes.has(scope.scope)}
                                                onChange={() => handleToggleScope(scope.scope)}
                                                className="peer absolute w-full h-full opacity-0 cursor-pointer"
                                                aria-label={`选择权限 ${scope.name}`}
                                            />
                                            <span
                                                className="w-5 h-5 rounded-full border-2 border-blue-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></span>
                                            <svg
                                                className="absolute w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 5.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* 状态提示 */}
                    {loading && (
                        <p className="text-center text-gray-500 text-sm select-none">正在加载权限信息...</p>
                    )}
                    {!loading && error && (
                        <p className="text-center text-red-600 text-sm select-none">{error}</p>
                    )}
                    {!loading && !error && scopes.length === 0 && (
                        <p className="text-center text-gray-500 text-sm select-none">未请求任何权限</p>
                    )}

                    {/* 授权/拒绝按钮 */}
                    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-16 px-4 sm:px-0">
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700 rounded-full px-10 py-3 font-semibold shadow-md transition duration-300"
                            onClick={handleReject}
                            type="button"
                        >
                            拒绝授权
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600 rounded-full px-12 py-3 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
                            onClick={handleAuthorize}
                            type="button"
                        >
                            授权
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 隐藏授权表单 */}
            <form ref={authorizeFormRef} action={oauthData?.data.authorizationEndpoint || ""} method="POST"
                  style={{display: "none"}}>
                <input type="hidden" name="client_id" value={clientIdParam}/>
                <input type="hidden" name="state" value={stateParam}/>
                {[...scopesToSubmit].map((scope) => (
                    <input key={scope} type="hidden" name="scope" value={scope}/>
                ))}
            </form>

            {/* 隐藏拒绝表单 */}
            <form ref={rejectFormRef} action={oauthData?.data.authorizationEndpoint || ""} method="POST"
                  style={{display: "none"}}>
                <input type="hidden" name="client_id" value={clientIdParam}/>
                <input type="hidden" name="state" value={stateParam}/>
            </form>
        </div>
    )
}
