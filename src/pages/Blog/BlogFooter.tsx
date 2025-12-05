import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "All blogs", href: "/blogs" },
  { label: "Dashboard", href: "/dashboard" },
];

const BlogFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">Blog App</p>
          <p> {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wide">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default BlogFooter;