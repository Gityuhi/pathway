import type { ReactNode } from "react"
import { Navigate, useOutletContext } from "react-router"
import type { Session } from "@supabase/supabase-js"

type AuthContext = {
  session: Session | null
}

export function GuestRoute({ children }: { children: ReactNode }) {
  const { session } = useOutletContext<AuthContext>()

  if (session) {
    return <Navigate to="/" replace />
  }

  return children
}
