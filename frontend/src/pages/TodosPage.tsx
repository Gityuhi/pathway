import { useNavigate, useOutletContext, useLocation } from "react-router"
import type { Session } from "@supabase/supabase-js"
import { SideBar, type NavKey } from "@/components/SideBar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogApp } from "@/features/logs/components/LogApp"
import { TodoApp } from "@/features/todos/components/TodoApp"
import { supabase } from "@/lib/supabase"
import { apolloClient } from "@/lib/apollo"

export function TodosPage() {
  const { session } = useOutletContext<{ session: Session | null }>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active: NavKey = pathname === "/log" ? "log" : "todos"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    await apolloClient.clearStore()
    navigate("/login")
  }

  const handleSelect = (key: NavKey) => {
    navigate(key === "log" ? "/log" : "/")
  }

  const title = active === "log" ? "Log" : "Todos"

  return (
    <SidebarProvider>
      <SideBar
        email={session?.user.email}
        active={active}
        onSelect={handleSelect}
        onSignOut={handleSignOut}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <div
          className={
            active === "log"
              ? "flex justify-center p-6"
              : "p-6"
          }
        >
          {active === "log" ? <LogApp /> : <TodoApp />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
