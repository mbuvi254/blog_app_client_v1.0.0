import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import useUserStore from '../../Store/userStore';
import { useNavigate, Link } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import { toastUtils } from "../../lib/toast";
import { LogIn, Mail, Lock } from "lucide-react";

interface UserInformation {
  emailAddress: string;
  password: string;
}

const AuthorLogin = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation<any, any, UserInformation>({
    mutationKey: ["login-user-key"],
    mutationFn: async (payload: UserInformation) => {
      console.log("Sending login request:", payload);
      const res = await api.post("/auth/login", payload);
      console.log("Login response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      setEmailAddress("");
      setPassword("");
      useUserStore.getState().setUser(data.data);
      toastUtils.auth.loginSuccess();
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.auth.loginFailed(derivedMessage, () => console.log("Retry login"));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailAddress || !password) {
      toastUtils.auth.validationError("Please provide all required fields", () => console.log("Focus on empty fields"));
      return;
    }
    loginMutation.mutate({ emailAddress, password });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md mx-auto p-8 bg-white border border-blue-100 shadow-lg">
        <div className="space-y-2 text-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-600">Blog App</p>
          <h1 className="text-3xl font-bold text-gray-900">Author login</h1>
          <p className="text-sm text-gray-600">Access the dashboard to manage posts, drafts, and automations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Email or username"
                required
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span></span>
            <Link to="/dashboard/update-password" className="text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline transition-colors">
              Forgot?
            </Link>
          </div>

          <Button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/dashboard/register" className="font-semibold text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline transition-colors">
            Create an author account
          </Link>
        </p>

        {loginMutation.isPending && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthorLogin;
