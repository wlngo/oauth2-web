import DynamicSidebar from "@/components/DynamicSidebar"

export default function UserManagementTest() {
    return (
        <DynamicSidebar 
            headerTitle="OAuth2 管理后台"
            headerSubtitle="用户管理"
            currentPage="/admin/users"
        >
            <div className="space-y-6">
                <h1>Test</h1>
            </div>
        </DynamicSidebar>
    )
}