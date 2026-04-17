"use client"

// import { AppSidebar } from "@/components/Private/Global/Sidebar/app-sidebar"
import { Sheet } from "@/components/ui/sheet"
import { UserProvider } from "@/context/UserContext"
import type { User } from "@/generated/prisma_client"
import Header from "@/components/Global/Header"
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/SideBar/app-sidebar"

export function Shell({ user, children }: { user: User | null; children: React.ReactNode }) {
    return (
        <UserProvider user={user}>
            <div className="bg-[url('/images/bg2.jpg')] bg-cover bg-center min-h-screen">
                <SidebarProvider className="gap-2 isolate pr-0! p-2 [&>div]:transition-all [&>div]:duration-800">
                    <Sheet>
                        <AppSidebar />
                        <SidebarInset className="relative bg-transparent">
                            <Header />
                            <main className="overflow-y-auto pr-2">
                                {children}
                            </main>
                        </SidebarInset>
                    </Sheet>
                </SidebarProvider>
            </div>
        </UserProvider>
    )
}
