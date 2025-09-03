import DynamicSidebar from "@/components/DynamicSidebar"

export default function PermissionManagement() {
    return (
        <DynamicSidebar 
            headerTitle="OAuth2 管理后台"
            headerSubtitle="权限管理"
            currentPage="/admin/permissions"
        >
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">权限管理</h1>
                <p>权限管理页面正在开发中...</p>
            </div>
        </DynamicSidebar>
    )
}