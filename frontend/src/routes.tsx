import { createBrowserRouter } from "react-router"
import App from "./App"
import { GuestRoute } from "./components/GuestRoute"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { LoginPage } from "./pages/LoginPage"
import { SignupPage } from "./pages/SignupPage"
import { TodosPage } from "./pages/TodosPage"

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <TodosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/log",
        element: (
          <ProtectedRoute>
            <TodosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/roadmap",
        element: (
          <ProtectedRoute>
            <TodosPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
