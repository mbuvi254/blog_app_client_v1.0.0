import DashboardLayout from "./Dashlayout";
import { useState, useEffect } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Published", value: "128", change: "+4 this week" },
  { label: "Drafts", value: "18", change: "−3 awaiting review" },
  { label: "Scheduled", value: "9", change: "Next post in 3h" },
  { label: "Views (7d)", value: "58.2k", change: "+18% vs last week" },
];

const topPosts = [
  { title: "Building a StoryBook CMS", metric: "8.4k views", trend: "+12%" },
  { title: "UX Basics for Editors", metric: "5.9k views", trend: "+32%" },
  { title: "Weekly newsletter #48", metric: "4.1k views", trend: "↔" },
];

const workflow = [
  { stage: "Needs review", count: 3, description: "Waiting on editors" },
  { stage: "Ready to publish", count: 2, description: "Scheduled this week" },
  { stage: "Blocked", count: 1, description: "Missing assets" },
];

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  
  const { emailAddress, setUser, clearUser } = useUserStore();
  const isLoggedIn = !!emailAddress;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data.data);
      } catch (err) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [setUser, clearUser]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Dashboard data refreshed");
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MainLoader />
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/dashboard/login");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to access the dashboard</h1>
          <p className="text-muted-foreground">You need to be authenticated to view this content.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Content overview" subtitle="Track publishing KPIs, approvals, and team focus.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="bg-card text-card-foreground rounded-2xl border border-border/60 p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{stat.change}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <section className="bg-card text-card-foreground rounded-2xl border border-border/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Top performing posts</h2>
              <p className="text-sm text-muted-foreground">Based on the last 7 days</p>
            </div>
            <span className="text-xs font-semibold text-emerald-500">+18% traffic</span>
          </div>
          <div className="mt-5 space-y-4">
            {topPosts.map((post) => (
              <div key={post.title} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.metric}</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{post.trend}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card text-card-foreground rounded-2xl border border-border/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Workflow status</h2>
              <p className="text-sm text-muted-foreground">Stay ahead of blockers</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Live sync"}
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {workflow.map((bucket) => (
              <div key={bucket.stage} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                <div>
                  <p className="font-semibold">{bucket.stage}</p>
                  <p className="text-xs text-muted-foreground">{bucket.description}</p>
                </div>
                <span className="text-xl font-semibold">{bucket.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
}

export default DashboardHome;
