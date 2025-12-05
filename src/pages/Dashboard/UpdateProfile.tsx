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

interface UserProfileState {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  token: string;
  isLoggedIn: boolean;
}

const UpdateProfile = () => {
  const { id, firstName: storeFirstName, lastName: storeLastName, username: storeUsername, emailAddress: storeEmail, setUser } = useUserStore();

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
      setUser((prev: UserProfileState) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        emailAddress: data.emailAddress,
      }));
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
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
            <header className="space-y-1">
              <h2 className="text-xl font-semibold">Personal details</h2>
              <p className="text-sm text-muted-foreground">Shared across dashboards and blog author cards.</p>
            </header>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">First name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
                <Input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} placeholder="Email address" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Button type="submit" className="px-12">
              {profileMutation.isLoading ? "Updating..." : "Publish changes"}
            </Button>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Security</h3>
            <p className="text-sm text-muted-foreground">Rotate passwords and enable MFA.</p>
            <Button type="button" variant="secondary" className="mt-4 w-full justify-center">
              Manage password
            </Button>
          </div>
        </aside>
      </form>

      {profileMutation.isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </DashboardLayout>
  );
};

export default UpdateProfile;
