import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from "../../components/ui/navigation-menu";
import { Link } from "react-router-dom";

const blogLinks = [
  { label: "Home", href: "/" },
  { label: "All Blogs", href: "/blogs" },
  { label: "Dashboard", href: "/dashboard" },
];

function BlogNav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
      <Link to="/" className="text-3xl font-bold uppercase tracking-wide">
        Blog App
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {blogLinks.map((link) => (
            <NavigationMenuLink key={link.label} asChild>
              <Link to={link.href} className="px-4 py-2">
                {link.label}
              </Link>
            </NavigationMenuLink>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export default BlogNav;