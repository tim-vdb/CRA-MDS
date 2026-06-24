"use client"

import { Separator } from "../../components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from "../../components/ui/sidebar"
import * as React from "react"
import { NavMain } from "./nav-main"

import { ToggleDarkMode } from "../DarkMode/ToggleDarkMode"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar()


  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>

        <ToggleDarkMode />

        <Separator orientation="horizontal" className="data-[orientation=vertical]:h-6 border border-neutral-500" />

        <div onClick={toggleSidebar} className="flex w-full h-8 overflow-hidden rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
          <SidebarTrigger onClick={(e) => { e.preventDefault() }} className="shrink-0 h-full w-8 cursor-pointer hover:bg-transparent! hover:text-inherit" />
          <span className="items_sidebar flex items-center truncate">
            Collapse
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
