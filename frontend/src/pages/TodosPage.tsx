import { useNavigate, useOutletContext } from "react-router"
import type { Session } from "@supabase/supabase-js"
import { TodoApp } from "@/features/todos/components/TodoApp"
import { supabase } from "@/lib/supabase"
import { apolloClient } from "@/lib/apollo"

export function TodosPage() {
  const { session } = useOutletContext<{ session: Session | null }>()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    await apolloClient.clearStore()
    navigate("/login")
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Todos</h1>
          <p className="text-muted-foreground text-sm">{session?.user.email}</p>
        </div>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
      <TodoApp />
    </div>
  )
}
