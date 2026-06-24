"use client"

import { useUser } from "../../context/UserContext"
import { ChevronsUpDown, LogOut as LogOutIcon, Settings } from "lucide-react"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import LogOut from "../Logout/components/logout"

export function NavUser() {
  const user = useUser()

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none w-72 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-900">
          <Avatar className="h-8 w-8 rounded-lg ring-2 ring-zinc-200 dark:ring-zinc-700">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} className="object-cover" />
            <AvatarFallback className="rounded-lg bg-linear-to-br from-primary to-primary/60 text-white text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:grid text-left text-sm leading-tight overflow-hidden">
            <span className="truncate font-semibold text-zinc-900 dark:text-zinc-50">{user?.name ?? "User"}</span>
            <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">{user?.email ?? ""}</span>
          </div>
          <ChevronsUpDown className="hidden sm:block ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 rounded-lg border-zinc-200 dark:border-zinc-700"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-3 text-left">
            <Avatar className="h-9 w-9 rounded-lg ring-2 ring-zinc-200 dark:ring-zinc-700">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-linear-to-br from-primary to-primary/60 text-white text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-zinc-900 dark:text-zinc-50">{user?.name ?? "User"}</span>
              <span className="truncate text-xs text-zinc-600 dark:text-zinc-400">{user?.email ?? ""}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-700" />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account" className="flex items-center gap-2 px-2 py-2 text-sm text-zinc-900 dark:text-zinc-50 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <Settings className="h-4 w-4" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-700" />
        <DropdownMenuItem className="cursor-pointer p-0">
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
