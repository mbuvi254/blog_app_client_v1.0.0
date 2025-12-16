import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from  "../../components/ui/button";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import useUserStore from "../../Store/userStore";
import { toastUtils } from "../../lib/toast";
import { UserPlus, Mail, User, Lock } from "lucide-react";

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
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-blue-100 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-600">Blog App</p>
          <h1 className="text-3xl font-bold text-gray-900">Create author account</h1>
          <p className="text-sm text-gray-600">Publish with confidence.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">First name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="First name" 
                  required 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Last name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Last name" 
                  required 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-blue-600">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={cpassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have access?{" "}
          <Link to="/dashboard/login" className="font-semibold text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
      
      {registerMutation.isPending && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <MainLoader />
        </div>
      )}
    </div>
  );
};

export default AuthorRegister;