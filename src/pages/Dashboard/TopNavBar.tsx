import { Bell, CirclePlus, Sparkles, LogOut, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import api from "../../lib/api";
import useUserStore from "../../Store/userStore";

interface TopNavBarProps {
  pageTitle?: string;
  subTitle?: string;
}

const TopNavBar = ({
  pageTitle = "Blog App",
  subTitle = "",
}: TopNavBarProps) => {
  const { emailAddress, firstName, lastName, username, clearUser } = useUserStore();
  const navigate = useNavigate();
  const isLoggedIn = !!emailAddress;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      clearUser();
      navigate("/dashboard/login");
    } catch (err) {
      console.error("Logout failed", err);
      clearUser();
      navigate("/dashboard/login");
    }
  };

  const getUserInitials = () => {
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (lastName) {
      return lastName.slice(0, 2).toUpperCase();
    }
    return "BA";
  };
  return (
    <header className="bg-background/90 text-foreground border-b border-border/60 sticky top-0 z-40 flex w-full flex-col gap-4 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="bg-primary/10 text-primary flex w-12 h-12 items-center justify-center rounded-2xl text-lg font-semibold">
          <Link to="/dashboard">
          {isLoggedIn ? getUserInitials() : "BA"}
          </Link>
        </div>

        <div className="min-w-[180px]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Dashboard
          </p>
          <p className="text-2xl font-semibold leading-tight">
            <Link to="/dashboard">
            {pageTitle}
            </Link>
            </p>
          {subTitle && <p className="text-sm text-muted-foreground">{subTitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button size="sm" variant="ghost" className="hidden md:flex gap-2">
                <Sparkles className="w-4 h-4" />
                Automations
              </Button>

              <Button size="sm" className="gap-2" asChild>
                <Link to="/dashboard/blogs/new">
                  <CirclePlus className="w-4 h-4" />
                  New post
                </Link>
              </Button>

              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="bg-muted/70 text-foreground flex w-10 h-10 items-center justify-center rounded-full text-sm font-semibold hover:bg-muted transition-colors">
                  {getUserInitials()}
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-card text-card-foreground border border-border/60 shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-muted" : ""
                            }`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/profile"
                            className={`block px-4 py-2 text-sm flex items-center gap-2 ${
                              active ? "bg-muted" : ""
                            }`}
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/blogs"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-muted" : ""
                            }`}
                          >
                            Blogs
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-border/60">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                active ? "bg-muted text-destructive" : "text-destructive"
                              }`}
                            >
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <Button asChild>
              <Link to="/dashboard/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
