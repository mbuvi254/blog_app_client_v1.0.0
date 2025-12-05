import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from  "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import useUserStore from "../../Store/userStore";
import { toastUtils } from "../../lib/toast";

interface UserInformation {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
  password: string;
}

const AuthorRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const navigate = useNavigate();

  const registerMutation = useMutation<any, any, UserInformation>({
    mutationKey: [`register-user-key`],
    mutationFn: async (payload: UserInformation) => {
      const res = await api.post("/auth/register", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setFirstName("");
      setLastName("");
      setEmailAddress("");
      setUsername("");
      setPassword("");
      setCPassword("");
      // Auto-login after successful registration
      useUserStore.getState().setUser(data.data);
      toastUtils.auth.registrationSuccess();
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.auth.registrationFailed(derivedMessage, () => console.log("Retry registration"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !emailAddress || !username || !password || !cpassword) {
      toastUtils.auth.validationError("Please provide all required fields", () => console.log("Focus on empty fields"));
      return;
    }
    if (password !== cpassword) {
      toastUtils.auth.passwordMismatch(() => console.log("Focus on password fields"));
      return;
    }

    registerMutation.mutate({
      firstName,
      lastName,
      emailAddress,
      username,
      password,
    });
  };
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-border/60 bg-card p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Blog App</p>
          <h1 className="text-3xl font-semibold">Create author account</h1>
          <p className="text-sm text-muted-foreground">Publish with confidence.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">First name</label>
              <Input 
                type="text" 
                placeholder="First name" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last name</label>
              <Input 
                type="text" 
                placeholder="Last name" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
            <Input 
              type="email" 
              placeholder="you@example.com" 
              required 
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Username</label>
            <Input 
              type="text" 
              placeholder="username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confirm password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have access?{" "}
          <Link to="/dashboard/login" className="font-semibold text-primary underline-offset-2 hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
      
      {registerMutation.isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </div>
  );
};

export default AuthorRegister;