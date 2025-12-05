// src/components/dashboard/SideBar.tsx
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  PenSquare,
  Trash,
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
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Published", path: "/dashboard/blogs/published", icon: FileText, badge: "24" },
      { label: "Drafts", path: "/dashboard/blogs/drafts", icon: FileText, badge: "24" },
      { label: "Blogs",path:"/dashboard/blogs",icon:FileText,badge:"0"},
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
      navigate("/dashboard/login");
    }
  };


  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="bg-background/90 text-foreground fixed left-4 top-[5.5rem] z-40 shadow lg:hidden"
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
          "bg-card/50 text-foreground border-border flex h-full w-72 flex-col border-r backdrop-blur",
          "fixed inset-y-0 left-0 z-50 -translate-x-full transition-transform duration-300 lg:static lg:translate-x-0",
          isMobileOpen && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4 lg:hidden">
          <p className="text-sm font-semibold">Navigation</p>
          <Button variant="ghost" size="icon" onClick={closeMobile} aria-label="Close dashboard menu">
            <X className="h-4 w-4" />
          </Button>
        </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive || pathname.startsWith(item.path)
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )
                  }
                  onClick={closeMobile}
                >
                  <item.icon className="size-4" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="text-muted-foreground/80 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-border/60 space-y-4 border-t px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
            DM
          </div>
          <div>
            <p className="text-sm font-semibold">{firstName} {lastName}</p>
            <p className="text-xs text-muted-foreground">Author</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
