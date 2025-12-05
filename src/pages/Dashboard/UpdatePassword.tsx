import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";

const UpdatePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (newPassword !== confirmPassword) {
    toastUtils.auth.validationError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  try {
    const res = await api.patch("/auth/password", {
      currentPassword,
      newPassword,
    });
    toastUtils.success("Password updated successfully!");
    navigate("/dashboard/profile");
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update password";
    toastUtils.error("Password update failed", message);
  } finally {
    setIsLoading(false);
  }
};


    return (
        <DashboardLayout title="Update Password">
            <div className="max-w-md">
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <Input type="password" placeholder="Enter current password" required onChange={(e) => setCurrentPassword(e.target.value)}/>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input type="password" placeholder="Enter new password" required onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input type="password" placeholder="Confirm new password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </div>
            
            {isLoading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <MainLoader />
                </div>
            )}
        </DashboardLayout>
    );
};

export default UpdatePassword;