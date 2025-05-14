
import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  onSearch?: (term: string) => void;
  showSearch?: boolean;
}

export default function Header({ title, onSearch, showSearch = true }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyName, setCompanyName] = useState("MyStore");
  const navigate = useNavigate();

  // Example notification data
  const notifications = [
    { id: 1, text: "5 products are low in stock", time: "Just now" },
    { id: 2, text: "New order received #1234", time: "10 minutes ago" },
    { id: 3, text: "Supplier delivery confirmed", time: "1 hour ago" },
  ];

  useEffect(() => {
    // Get company name from local storage or use default
    const savedName = localStorage.getItem("companyName");
    if (savedName) {
      setCompanyName(savedName);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex flex-col border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="text-xl font-semibold truncate">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {showSearch && (
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] lg:w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="py-2 cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span>{notification.text}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {companyName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium hidden lg:inline-block">
                  {companyName}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
