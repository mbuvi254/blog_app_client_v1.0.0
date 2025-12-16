import DashboardLayout from "./Dashlayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, TrendingUp, Clock, Users, Key, Edit } from "lucide-react";



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
        // bio: "Story-driven marketer crafting thoughtful narratives across product launches, growth updates, and weekly newsletters.",
  };

  return (
    <DashboardLayout title="Author Profile" subtitle="Manage your author profile">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader className="border-blue-100 border-b pb-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-semibold shadow-lg">
                  {author.firstName?.[0]}{author.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {author.firstName} {author.lastName}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{author.role} • {author.location}</CardDescription>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full justify-center border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700" 
                    asChild
                  >
                    <Link to="/dashboard/profile/update/password" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Update password
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isLoading}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <MainLoader />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 text-sm text-gray-600 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-600">Email</p>
                    <p className="text-gray-900 font-medium">{author.emailAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-600">Primary focus</p>
                    <p className="text-gray-900 font-medium">Content strategy</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-600">Timezone</p>
                    <p className="text-gray-900 font-medium">GMT +3</p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-6 text-gray-600">{author.bio}</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Thought leadership</span>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Weekly newsletter</span>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Product launches</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Performance</CardTitle>
              <CardDescription className="text-gray-600">Snapshot of how your content is performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-blue-100 bg-white px-4 py-3 hover:shadow-md transition-shadow duration-200">
                    <p className="text-xs uppercase tracking-wide text-blue-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs font-medium text-green-600">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AuthorProfile;