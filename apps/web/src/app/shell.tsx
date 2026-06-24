"use client"

// import { AppSidebar } from "@/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "../components/ui/sheet"
import { UserProvider } from "../context/UserContext"
import type { User } from "../generated/prisma_client"
import Header from "../components/Global/Header"
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar"
import { AppSidebar } from "../features/SideBar/app-sidebar"
import { usePathname } from "next/navigation"

export function Shell({ user, children }: { user: User | null; children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = pathname === "/login" || pathname === "/register"

    if (isAuthPage) {
        return (
            <UserProvider user={user}>
                <div className="bg-cover bg-center h-screen flex items-center justify-center">
                    {children}
                </div>
            </UserProvider>
        )
    }

    return (
        <UserProvider user={user}>
            <div className="bg-cover bg-center h-screen overflow-hidden">
                <SidebarProvider className="h-full gap-2 isolate pr-0! p-2 [&>div]:transition-all [&>div]:duration-800">
                    <Sheet>
                        <AppSidebar />
                        <SidebarInset className="relative bg-transparent overflow-hidden">
                            <Header />
                            <main className="flex-1 overflow-y-auto pr-2">
                                {children}
                            </main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
