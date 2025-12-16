// src/components/dashboard/SideBar.tsx
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  PenSquare,
  Trash,
  Home,
  User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import userStore from "../../Store/userStore"
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
};



const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard Home", path: "/dashboard", icon: LayoutDashboard },
      { label: "Profile", path: "/dashboard/profile", icon: User },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Published", path: "/dashboard/blogs/published", icon: FileText, badge: "24" },
      { label: "Drafts", path: "/dashboard/blogs/drafts", icon: FileText, badge: "24" },
      { label: "All Blogs", path: "/dashboard/blogs", icon: FileText },
      { label: "New Post", path: "/dashboard/blogs/new", icon: PenSquare },
      { label: "Trash", path: "/dashboard/blogs/trash", icon: Trash, badge: "6" },
    ],
  }
];

const SideBar = () => {
  const { pathname } = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

    // const emailAddress = userStore(state => state.emailAddress);
    const firstName = userStore(state => state.firstName);
    const lastName = userStore(state=> state.lastName);
    // const username = userStore(state=>state.username)

    const navigate = useNavigate();
    const { clearUser } = userStore();

    const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      clearUser();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      clearUser();
      navigate("/");
    }
  };


  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="bg-white border-blue-200 text-blue-600 fixed left-4 top-[5.5rem] z-40 shadow-lg hover:bg-blue-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open dashboard menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "bg-white border-blue-100 text-gray-900 flex h-full w-72 flex-col border-r shadow-sm",
          "fixed inset-y-0 left-0 z-50 -translate-x-full transition-transform duration-300 lg:static lg:translate-x-0",
          isMobileOpen && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-blue-100 px-4 py-4 lg:hidden">
          <p className="text-sm font-semibold text-gray-900">Navigation</p>
          <Button variant="ghost" size="icon" onClick={closeMobile} aria-label="Close dashboard menu" className="text-gray-600 hover:text-blue-600">
            <X className="h-4 w-4" />
          </Button>
        </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-blue-600">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive || pathname.startsWith(item.path)
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    )
                  }
                  onClick={closeMobile}
                >
                  <item.icon className="size-4" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-blue-100 space-y-4 border-t px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex size-10 items-center justify-center rounded-full text-sm font-semibold shadow-md">
            {firstName ? firstName.slice(0, 2).toUpperCase() + (lastName ? lastName.slice(0, 2).toUpperCase() : "") : "BA"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{firstName} {lastName}</p>
            <p className="text-xs text-gray-600">Author</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="mr-2 size-4" />
            Log out
          </Button>
        </div>
      </div>
      </aside>
    </>
  );
};

export default SideBar;
