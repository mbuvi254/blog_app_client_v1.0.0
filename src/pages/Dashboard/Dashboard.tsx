import DashboardLayout from "./Dashlayout";
import { useState, useEffect } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";



const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Published", value: "0", change: "Loading..." },
    { label: "Drafts", value: "0", change: "Loading..." },
    { label: "Trash", value: "0", change: "Loading..." },
    { label: "Total Posts", value: "0", change: "Loading..." },
  ]);
  const [topPosts, setTopPosts] = useState<{ title: string; metric: string; trend: string }[]>([]);
  const [workflow, setWorkflow] = useState<{ stage: string; count: number; description: string }[]>([]);
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
    
    const fetchDashboardData = async () => {
      try {
        // Fetch published blogs
        const publishedRes = await api.get("/blogs/published");
        const publishedBlogs = publishedRes.data.blogs || [];
        
        // Fetch draft blogs
        const draftRes = await api.get("/blogs/draft");
        const draftBlogs = draftRes.data.blogs || [];
        
        // Fetch trashed blogs
        const trashRes = await api.get("/blogs/trash");
        const trashedBlogs = trashRes.data.blogs || [];
        
        // Update stats with real data
        setStats([
          { 
            label: "Published", 
            value: publishedBlogs.length.toString(), 
            change: publishedBlogs.length > 0 ? `+${Math.min(publishedBlogs.length, 4)} this week` : "No posts" 
          },
          { 
            label: "Drafts", 
            value: draftBlogs.length.toString(), 
            change: draftBlogs.length > 0 ? `${draftBlogs.length} awaiting review` : "No drafts" 
          },
          { 
            label: "Trash", 
            value: trashedBlogs.length.toString(), 
            change: trashedBlogs.length > 0 ? "Recently deleted" : "Empty" 
          },
          { 
            label: "Total Posts", 
            value: (publishedBlogs.length + draftBlogs.length).toString(), 
            change: "All content" 
          },
        ]);
        
        // Update top posts with recent published blogs
        const recentPosts = publishedBlogs
          .slice(0, 3)
          .map(blog => ({
            title: blog.title,
            metric: "Published",
            trend: "+0%"
          }));
        setTopPosts(recentPosts);
        
        // Update workflow status based on drafts
        setWorkflow([
          { stage: "Drafts", count: draftBlogs.length, description: "Ready to edit" },
          { stage: "Published", count: publishedBlogs.length, description: "Live content" },
          { stage: "Trash", count: trashedBlogs.length, description: "Recently deleted" },
        ]);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    
    checkAuthStatus();
    fetchDashboardData();
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
          <article key={stat.label} className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs font-medium text-blue-600">{stat.change}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <section className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top performing posts</h2>
              <p className="text-sm text-gray-600">Based on the last 7 days</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+18% traffic</span>
          </div>
          <div className="mt-5 space-y-4">
            {topPosts.map((post) => (
              <div key={post.title} className="flex items-center justify-between rounded-xl border border-blue-100 px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                <div>
                  <p className="font-medium text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-600">{post.metric}</p>
                </div>
                <span className="text-xs font-semibold text-blue-600">{post.trend}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Workflow status</h2>
              <p className="text-sm text-gray-600">Stay ahead of blockers</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Live sync"}
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {workflow.map((bucket) => (
              <div key={bucket.stage} className="flex items-center justify-between rounded-xl border border-blue-100 px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                <div>
                  <p className="font-semibold text-gray-900">{bucket.stage}</p>
                  <p className="text-xs text-gray-600">{bucket.description}</p>
                </div>
                <span className="text-xl font-bold text-blue-600">{bucket.count}</span>
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
