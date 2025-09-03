import DynamicSidebar from "@/components/DynamicSidebar"

export default function RoleManagement() {
    return (
        <DynamicSidebar 
            headerTitle="OAuth2 管理后台"
            headerSubtitle="角色管理"
            currentPage="/admin/roles"
        >
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">角色管理</h1>
                <p>角色管理页面正在开发中...</p>
            </div>
        </DynamicSidebar>
    )
}