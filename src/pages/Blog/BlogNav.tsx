import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from "../../components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Home, FileText, Menu, X } from "lucide-react";

const blogLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "All Blogs", href: "/blogs", icon: FileText },
];

function BlogNav() {
  return (
    <header className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Blog App
              </h1>
              <p className="text-xs text-gray-500">Modern Blog Platform</p>
            </div>
          </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-1">
          {blogLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavigationMenuLink key={link.label} asChild>
                <Link 
                  to={link.href} 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              </NavigationMenuLink>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
        </div>
      </div>
    </header>
  );
}

export default BlogNav;