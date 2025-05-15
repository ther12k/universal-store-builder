
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/inventory": "Inventory Management",
  "/products": "Products",
  "/transactions": "Transactions",
  "/orders": "Orders",
  "/suppliers": "Suppliers",
  "/reports": "Reports",
  "/settings": "Settings",
};

interface LayoutProps {
  children: ReactNode;
  onSearch?: (term: string) => void;
  showSearch?: boolean;
}

export default function Layout({ children, onSearch, showSearch = true }: LayoutProps) {
  const location = useLocation();
  const title = routeTitles[location.pathname] || "StockTrack";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={title} onSearch={onSearch} showSearch={showSearch} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
