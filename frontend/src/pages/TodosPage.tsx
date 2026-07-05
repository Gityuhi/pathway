import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
import type { Session } from "@supabase/supabase-js"
import { SideBar, type NavKey } from "@/components/SideBar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TodoApp } from "@/features/todos/components/TodoApp"
import { supabase } from "@/lib/supabase"
import { apolloClient } from "@/lib/apollo"

export function TodosPage() {
  const { session } = useOutletContext<{ session: Session | null }>()
  const navigate = useNavigate()
  const [active, setActive] = useState<NavKey>("todos")

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    await apolloClient.clearStore()
    navigate("/login")
  }

  return (
    <SidebarProvider>
      <SideBar
        email={session?.user.email}
        active={active}
        onSelect={setActive}
        onSignOut={handleSignOut}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Todos</h1>
        </header>
        <div className="p-6">
          <TodoApp />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
