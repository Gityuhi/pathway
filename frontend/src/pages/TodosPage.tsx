import { useCallback, type ComponentType } from "react"
import { useNavigate, useOutletContext, useLocation } from "react-router"
import type { Session } from "@supabase/supabase-js"
import { SideBar, type NavKey } from "@/components/SideBar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogApp } from "@/features/logs/components/LogApp"
import { RoadmapApp } from "@/features/roadmap/components/RoadmapApp"
import { TodoApp } from "@/features/todos/components/TodoApp"
import { supabase } from "@/lib/supabase"
import { apolloClient } from "@/lib/apollo"

const navRoutes: Record<NavKey, string> = {
  todos: "/",
  log: "/log",
  roadmap: "/roadmap",
}

const navTitles: Record<NavKey, string> = {
  todos: "Todos",
  log: "Log",
  roadmap: "Roadmap",
}

const navApps: Record<NavKey, ComponentType> = {
  todos: TodoApp,
  log: LogApp,
  roadmap: RoadmapApp,
}

const navContentClass: Record<NavKey, string> = {
  todos: "p-6",
  log: "flex justify-center p-6",
  roadmap: "p-6",
}

function navKeyFromPathname(pathname: string): NavKey {
  if (pathname === "/log") return "log"
  if (pathname === "/roadmap") return "roadmap"
  return "todos"
}

export function TodosPage() {
  const { session } = useOutletContext<{ session: Session | null }>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = navKeyFromPathname(pathname)
  const ActiveApp = navApps[active]

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    await apolloClient.clearStore()
    navigate("/login")
  }, [navigate])

  const handleSelect = useCallback((key: NavKey) => {
    navigate(navRoutes[key])
  }, [navigate])

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
          <h1 className="text-lg font-semibold">{navTitles[active]}</h1>
        </header>
        <div className={navContentClass[active]}>
          <ActiveApp />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
