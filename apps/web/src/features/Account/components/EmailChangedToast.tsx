"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function EmailChangedToast() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/account")
    router.refresh()
    toast.success("Your email has been updated")
  }, [router])

  return null
}
