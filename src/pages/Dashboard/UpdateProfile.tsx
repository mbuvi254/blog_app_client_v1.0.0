import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import useUserStore from "../../Store/userStore";
import toastUtils from "../../lib/toast";
import api from "../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Loader2 } from "lucide-react";

const UpdateProfile = () => {
  const { firstName: storeFirstName, lastName: storeLastName, username: storeUsername, emailAddress: storeEmail, setUser } = useUserStore();

  const [firstName, setFirstName] = useState(storeFirstName);
  const [lastName, setLastName] = useState(storeLastName);
  const [username, setUsername] = useState(storeUsername);
  const [emailAddress, setEmailAddress] = useState(storeEmail);

  const navigate = useNavigate();

  const profileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; username: string; emailAddress: string }) => {
      const res = await api.patch("/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      toastUtils.dismiss();
      toastUtils.success("Profile updated!", "Your profile has been updated");
      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        emailAddress: data.emailAddress,
      });
      navigate("/dashboard/profile");
    },
    onError: (error: any, variables) => {
      toastUtils.dismiss();
      const message = error?.response?.data?.message || error?.message || "Failed to update profile";
      toastUtils.error("Profile update failed", message, "Retry", () => {
        profileMutation.mutate(variables);
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !emailAddress) {
      toastUtils.auth.validationError("All fields are required");
      return;
    }

    profileMutation.mutate({ firstName, lastName, username, emailAddress });
  };

  return (
    <DashboardLayout title="Update profile" subtitle="Refresh your personal info, tags, and communication preferences.">
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
            <header className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Personal details</h2>
              <p className="text-sm text-gray-600">Shared across dashboards and blog author cards.</p>
            </header>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="First name" 
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Last name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Last name" 
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    type="email" 
                    value={emailAddress} 
                    onChange={(e) => setEmailAddress(e.target.value)} 
                    placeholder="Email address" 
                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Button 
              type="submit" 
              className="px-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {profileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Publish changes"
              )}
            </Button>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Security</h3>
            </div>
            <p className="text-sm text-gray-600">Rotate passwords and enable MFA.</p>
            <Button 
              type="button" 
              variant="outline" 
              className="mt-4 w-full justify-center border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Manage password
            </Button>
          </div>
        </aside>
      </form>

      {profileMutation.isPending && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default UpdateProfile;
