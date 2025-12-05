import type { ReactNode } from "react";
import BlogNav from "./BlogNav";
import BlogFooter from "./BlogFooter";

type BlogLayoutProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
};

const BlogLayout = ({
  title = "Blog Home",
  subtitle = "Latest product, design, and growth stories",
  children,
}: BlogLayoutProps) => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="w-full px-4 py-6">
        <BlogNav />

        <main className="mt-10 space-y-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              {title === "Blog Home" ? "Latest Stories" : title}
            </p>
            {/* <h1 className="text-4xl font-semibold leading-tight">{title}</h1> */}
            {/* <p className="text-muted-foreground text-base">{subtitle}</p> */}
          </header>

          {children ?? (
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Start publishing from the dashboard to see content appear here.
              </p>
            </section>
          )}
        </main>
      </div>

      <BlogFooter />
    </div>
  );
};

export default BlogLayout;
