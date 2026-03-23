"use client"

import { ArrowRight, Book, BookOpen, BookText, Calendar, FileText, Folder, Gamepad, Home, Inbox, LogOut, Play, Search, Settings, Tally1, Users } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { cn } from "../../utils/utils"

// Menu items.
const settingsData = [
    {
        title: "Overview",
        url: "/",
        icon: Home,
    },
]

const Data = [
    {
        title: "Introduction",
        url: "/",
        icon: BookText,
    },
    {
        title: "Gallery",
        url: "/admin/gallery",
        icon: Folder,
    },
    {
        title: "Events",
        url: "/admin/events",
        icon: Calendar,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Create Blog",
        url: "/admin/blog/create",
        icon: FileText,
    },
    {
        title: "Quitter",
        url: "/",
        icon: LogOut,
    },
]

export default function AppSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <Sidebar>
            <SidebarContent className="w-[16rem] py-4 border-r-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2 text-lg border-b-4 border-black pb-3 rounded-none">
                        <Settings className="h-5 w-5" />
                        Getting started
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mb-6">
                        <SidebarMenu>
                            {settingsData.map((item: typeof settingsData[0]) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className={cn(
                                            "mt-2 font-inter transition-all duration-200",
                                            isActive(item.url)
                                                ? " text-blue-600"
                                                : "text-black hover:text-blue-700"
                                        )}
                                        asChild
                                    >
                                        <a href={item.url}>
                                            <item.icon className={cn(
                                                "h-4 w-4",
                                                isActive(item.url) ? "text-blue-600" : "text-black"
                                            )} />
                                            <span >{item.title}</span>
                                            {isActive(item.url) && (
                                                <Tally1 className="w-5 h-5 text-blue-600 ml-auto" />
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel className="flex items-center gap-2 text-lg border-b-4 border-black pb-3 rounded-none">
                        <Gamepad className="h-5 w-5" />
                        Reference
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Data.map((item: typeof Data[0]) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className={cn(
                                            "mt-2 font-inter transition-all duration-200",
                                            isActive(item.url)
                                                ? " text-blue-600"
                                                : "hover:text-blue-700"
                                        )}
                                        asChild
                                    >
                                        <a href={item.url}>
                                            <item.icon className={cn(
                                                "h-4 w-4",
                                                isActive(item.url) ? "text-blue-600" : "text-black"
                                            )} />
                                            <span>{item.title}</span>
                                            {isActive(item.url) && (
                                                <Tally1 className="w-5 h-5 text-blue-600 ml-auto" />
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}   