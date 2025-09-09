import {createRootRoute} from '@tanstack/react-router'
import {Outlet} from '@tanstack/react-router'

function RootLayout() {
    return <Outlet />
}

export const rootRoute = createRootRoute({
    component: RootLayout,
})
