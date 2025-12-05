import DashboardLayout from "./Dashlayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import { useNavigate } from "react-router-dom";



const stats = [
  { label: "Published", value: "128", detail: "+4 this week" },
  { label: "Avg. read time", value: "6 min", detail: "↑ faster than avg" },
  { label: "Followers", value: "5.6k", detail: "+320 this month" },
];


const AuthorProfile = () => {
  const { firstName, lastName, username, emailAddress, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    navigate("/dashboard/profile/update");
    setIsLoading(false);
  };

  const author = {
        firstName: firstName,
        lastName: lastName,
        role: "Author",
        location: "Nairobi, Kenya",
        emailAddress: emailAddress,
        bio: "Story-driven marketer crafting thoughtful narratives across product launches, growth updates, and weekly newsletters.",
  };

  return (
    <DashboardLayout title="Author Profile" subtitle="Manage your author profile">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-border/60 border-b pb-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-semibold">
                  DM
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold">
                    {author.firstName} {author.lastName}
                  </CardTitle>
                  <CardDescription>{author.role} • {author.location}</CardDescription>
                </div>
                <Button variant="secondary" className="mt-4 w-full justify-center" asChild>
                  <Link to="/dashboard/profile/update/password">Update password</Link>
                </Button>
                <Button onClick={handleUpdateProfile} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide">Email</p>
                  <p className="text-foreground font-medium">{author.emailAddress}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide">Primary focus</p>
                  <p className="text-foreground font-medium">Content strategy</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide">Timezone</p>
                  <p className="text-foreground font-medium">GMT +3</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{author.bio}</p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="rounded-full border border-border/60 px-3 py-1">Thought leadership</span>
                <span className="rounded-full border border-border/60 px-3 py-1">Weekly newsletter</span>
                <span className="rounded-full border border-border/60 px-3 py-1">Product launches</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Snapshot of how your content is performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs font-medium text-emerald-500">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AuthorProfile;