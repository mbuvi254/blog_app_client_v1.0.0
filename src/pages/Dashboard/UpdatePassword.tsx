import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import { Lock, Shield, Loader2 } from "lucide-react";

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
    await api.patch("/auth/password", {
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
        <DashboardLayout title="Update Password" subtitle="Secure your account with a new password">
            <div className="max-w-md mx-auto">
                <div className="bg-white border border-blue-100 rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl shadow-lg">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Update Password</h2>
                            <p className="text-sm text-gray-600">Choose a strong password to protect your account</p>
                        </div>
                    </div>
                
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                    type="password" 
                                    placeholder="Enter current password" 
                                    required 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    required 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                    type="password" 
                                    placeholder="Confirm new password" 
                                    required 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
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

export default UpdatePassword;