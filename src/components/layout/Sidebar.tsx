import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Upload, 
  FileText, 
  AlertTriangle, 
  Scale, 
  Folder,
  Settings,
  User
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Risks", href: "/risks", icon: AlertTriangle },
  { name: "Compare", href: "/compare", icon: Scale },
  { name: "Obligations", href: "/obligations", icon: Folder },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-legal-primary to-legal-info flex items-center justify-center">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold">LexiLight</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-legal-primary text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Legal User</p>
            <p className="text-xs text-slate-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};