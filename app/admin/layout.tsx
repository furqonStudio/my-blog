import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => (
  <SidebarProvider
    style={
      {
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" />
    <SidebarInset>{children}</SidebarInset>
  </SidebarProvider>
)

export default AdminLayout
