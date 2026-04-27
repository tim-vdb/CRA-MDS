"use client"

import { usePathname } from "next/navigation"
import { NavUser } from "@/features/SideBar/nav-user"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import React from "react"

const ROUTE_LABELS: Record<string, string> = {
  "": "Tableau de bord",
  clients: "Clients",
  dashboard: "Tableau de bord",
  account: "Mon compte",
  admin: "Administration",
  profile: "Profil",
  settings: "Paramètres",
}

function getLabel(segment: string, index: number, segments: string[]): string {
  if (index > 0 && segments[index - 1] === "clients") return "Fiche client"
  return ROUTE_LABELS[segment] ?? (segment.charAt(0).toUpperCase() + segment.slice(1))
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return [{ label: "Tableau de bord", href: undefined }]
  }

  const crumbs: { label: string; href?: string }[] = [
    { label: "Tableau de bord", href: "/" },
  ]

  let currentPath = ""
  segments.forEach((segment, i) => {
    currentPath += `/${segment}`
    const label = getLabel(segment, i, segments)
    const isLast = i === segments.length - 1
    crumbs.push({ label, href: isLast ? undefined : currentPath })
  })

  return crumbs
}

export default function Header() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex items-center justify-between gap-2 px-6 w-full">
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-600" />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-sm">
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-zinc-900 dark:text-zinc-50 font-semibold text-sm">{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <NavUser />
      </div>
    </header>
  )
}