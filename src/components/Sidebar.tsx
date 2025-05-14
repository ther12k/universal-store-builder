
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  ChevronLeft, 
  Home, 
  PackageSearch, 
  BarChart4, 
  ShoppingCart, 
  Users, 
  Settings, 
  Package, 
  RefreshCcw
} from "lucide-react";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/"
  },
  {
    title: "Inventory",
    icon: PackageSearch,
    path: "/inventory"
  },
  {
    title: "Products",
    icon: Package,
    path: "/products"
  },
  {
    title: "Transactions",
    icon: RefreshCcw,
    path: "/transactions"
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/orders"
  },
  {
    title: "Suppliers",
    icon: Users,
    path: "/suppliers"
  },
  {
    title: "Reports",
    icon: BarChart4,
    path: "/reports"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground h-screen border-r border-sidebar-border transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <span className="text-xl font-bold ml-2 text-sidebar-foreground">
              StockTrack
            </span>
          )}
          {collapsed && <Package size={24} />}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center py-3 px-4 transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground",
                collapsed && "justify-center"
              )
            }
          >
            <item.icon size={20} className={cn("flex-shrink-0", !collapsed && "mr-3")} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
