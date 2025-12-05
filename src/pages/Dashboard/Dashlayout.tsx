import { type ReactNode } from "react";
import SideBar from "./SideBar";
import TopNavBar from "./TopNavBar";
import { ToastContainer } from "react-toastify";
import toastUtils from "../../lib/toast";
interface DashboardLayoutProps {
  children: ReactNode; // Dynamic content for main area
  title?: string;      // Optional page title
  subtitle?: string;   // Optional page subtitle/description
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <TopNavBar />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <main className="bg-muted/30 flex-1 overflow-y-auto">
          <section className="space-y-6 px-8 py-6">
            {title && (
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Today</p>
                <h1 className="text-3xl font-semibold leading-tight">{title}</h1>
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
              </div>
            )}
            <ToastContainer />
            <toastUtils />

            {/* Dynamic content goes here */}
            <div>{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
