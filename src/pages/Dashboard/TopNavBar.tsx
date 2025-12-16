import { Bell, CirclePlus, Sparkles, LogOut, User, Home, FileText } from "lucide-react";
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
  const { emailAddress, firstName, lastName, clearUser } = useUserStore();
  const navigate = useNavigate();
  const isLoggedIn = !!emailAddress;

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
    <header className="bg-white border-b border-blue-100 text-gray-900 sticky top-0 z-40 flex w-full flex-col gap-4 px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex w-12 h-12 items-center justify-center rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Link to="/dashboard">
          {isLoggedIn ? getUserInitials() : "BA"}
          </Link>
        </div>

        <div className="min-w-[180px]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Dashboard
          </p>
          <p className="text-2xl font-bold leading-tight text-gray-900">
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors duration-200">
            {pageTitle}
            </Link>
            </p>
          {subTitle && <p className="text-sm text-gray-600">{subTitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button size="sm" variant="ghost" className="hidden md:flex gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                <Sparkles className="w-4 h-4" />
                Automations
              </Button>

              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link to="/dashboard/blogs/new">
                  <CirclePlus className="w-4 h-4" />
                  New post
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                <Bell className="w-4 h-4" />
              </Button>

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="bg-blue-100 text-blue-600 flex w-10 h-10 items-center justify-center rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors">
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
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4" />
                              Dashboard
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/profile"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Profile
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/blogs"
                            className={`block px-4 py-2 text-sm ${
                              active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Blogs
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-200">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-red-50 text-red-600" : "text-red-600"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                Logout
                              </div>
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
