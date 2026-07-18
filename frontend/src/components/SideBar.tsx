import type { ComponentProps } from "react"
import { CalendarDays, ListTodo, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export type NavKey = "todos" | "log"

const navItems: { key: NavKey; label: string; icon: typeof ListTodo }[] = [
  { key: "todos", label: "Todos", icon: ListTodo },
  { key: "log", label: "Log", icon: CalendarDays },
]

type SideBarProps = Omit<ComponentProps<typeof Sidebar>, "onSelect"> & {
  email?: string
  active: NavKey
  onSelect: (key: NavKey) => void
  onSignOut: () => void
}

export function SideBar({
  email,
  active,
  onSelect,
  onSignOut,
  ...props
}: SideBarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="px-2 py-1.5 text-lg font-semibold">Pathway</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ key, label, icon: Icon }) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    isActive={active === key}
                    tooltip={label}
                    onClick={() => onSelect(key)}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {email ? (
          <div className="truncate px-2 text-xs text-muted-foreground">
            {email}
          </div>
        ) : null}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" onClick={onSignOut}>
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
