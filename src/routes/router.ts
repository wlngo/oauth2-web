import * as React from 'react'
import {createRootRoute} from '@tanstack/react-router'
import {Outlet} from '@tanstack/react-router'

function RootLayout() {
    return React.createElement(Outlet)
}

export const rootRoute = createRootRoute({
    component: RootLayout,
})
