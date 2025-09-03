import DynamicSidebar from "@/components/DynamicSidebar"

export default function MenuManagement() {
    return (
        <DynamicSidebar 
            headerTitle="OAuth2 管理后台"
            headerSubtitle="菜单管理"
            currentPage="/admin/menus"
        >
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">菜单管理</h1>
                <p>菜单管理页面正在开发中...</p>
            </div>
        </DynamicSidebar>
    )
}