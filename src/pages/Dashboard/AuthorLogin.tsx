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
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md mx-auto p-8">
        <div className="space-y-2 text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Blog App</p>
          <h1 className="text-3xl font-semibold">Author login</h1>
          <p className="text-sm text-muted-foreground">Access the dashboard to manage posts, drafts, and automations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Input
              type="text"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Email or username"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span></span>
            <Link to="/dashboard/update-password" className="text-primary underline-offset-2 hover:underline">
              Forgot?
            </Link>
          </div>

          <Button type="submit" className="w-full py-2" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/dashboard/register" className="font-semibold text-primary underline-offset-2 hover:underline">
            Create an author account
          </Link>
        </p>

        {loginMutation.isPending && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthorLogin;
