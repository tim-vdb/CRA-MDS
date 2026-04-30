"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChartColumn, ChevronRight, House, LayoutDashboard, Settings2, Users, type LucideIcon } from "lucide-react"
import Link from "next/link"

type NavSubItem = {
  title: string
  url: string
}

type NavMainDropdown = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items: NavSubItem[]
}

type NavMain = {
  title: string
  url: string
  icon: LucideIcon
}

const navMainItem: NavMain[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartColumn,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
]

const navDropdown: NavMainDropdown[] = [
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "Account",
        url: "/account",
      },
    ],
  },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navMainItem.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {navDropdown.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span className="items_sidebar">
                    {item.title}
                  </span>
                  <ChevronRight className="ml-auto transition-[transform,opacity] duration-800 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:opacity-0" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span className="items_sidebar">
                            {subItem.title}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
