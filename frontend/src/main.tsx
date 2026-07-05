import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ApolloProvider } from "@apollo/client/react"
import { RouterProvider } from "react-router"
import "./index.css"
import { apolloClient } from "@/lib/apollo"
import { router } from "./routes"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
)
