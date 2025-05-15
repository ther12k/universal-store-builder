
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
  "/scanner": "Scanner",
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
    <div className="drawer lg:drawer-open bg-base-100">
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        <Header title={title} onSearch={onSearch} showSearch={showSearch} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      
      <div className="drawer-side z-40">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}
