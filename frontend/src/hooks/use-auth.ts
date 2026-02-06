import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api";

type User = z.infer<typeof api.user.me.responses[200]>;
type LoginInput = z.infer<typeof api.auth.login.input>;
type RegisterInput = z.infer<typeof api.auth.register.input>;
type FaceLoginInput = z.infer<typeof api.auth.faceLogin.input>;
type SendOtpInput = z.infer<typeof api.auth.sendOtp.input>;
type VerifyOtpInput = z.infer<typeof api.auth.verifyOtp.input>;
type ResetPasswordInput = z.infer<typeof api.auth.resetPassword.input>;

// Helper function to get dashboard route based on user role
function getDashboardRoute(role?: string): string {
  switch (role) {
    case "company_admin":
      return "/dashboard/admin";
    case "company_hr":
      return "/dashboard/hr";
    case "candidate":
    default:
      return "/dashboard/candidate";
  }
}

export function useUser() {
  return useQuery({
    queryKey: [api.user.me.path],
    queryFn: async () => {
      const res = await fetch(apiUrl(api.user.me.path), { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.user.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await fetch(apiUrl(api.auth.login.path), {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.user.me.path], user);
      toast({ title: "ACCESS GRANTED", description: `Welcome back, ${user.username}.` });
      setLocation(getDashboardRoute(user.role));
    },
    onError: (error: Error) => {
      toast({ 
        title: "ACCESS DENIED", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useFaceLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: FaceLoginInput) => {
      const res = await fetch(apiUrl(api.auth.faceLogin.path), {
        method: api.auth.faceLogin.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Face recognition failed");
      }
      return api.auth.faceLogin.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.user.me.path], user);
      toast({ 
        title: "BIOMETRIC MATCH CONFIRMED", 
        description: `Identity verified: ${user.username}`,
        className: "border-primary text-primary"
      });
      setLocation(getDashboardRoute(user.role));
    },
    onError: (error: Error) => {
      toast({ 
        title: "IDENTITY MISMATCH", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch(apiUrl(api.auth.register.path), {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.user.me.path], user);
      toast({ title: "IDENTITY REGISTERED", description: "User profile created successfully." });
      setLocation(getDashboardRoute(user.role));
    },
    onError: (error: Error) => {
      toast({ 
        title: "REGISTRATION ERROR", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });
}

export function useSendOtp() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SendOtpInput) => {
      const res = await fetch(apiUrl(api.auth.sendOtp.path), {
        method: api.auth.sendOtp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send OTP");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "OTP SENT", description: "Check your email for the verification code." });
    },
    onError: (error: Error) => {
      toast({ title: "OTP ERROR", description: error.message, variant: "destructive" });
    },
  });
}

export function useVerifyOtp() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: VerifyOtpInput) => {
      const res = await fetch(apiUrl(api.auth.verifyOtp.path), {
        method: api.auth.verifyOtp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "OTP verification failed");
      }
      return json as { message: string; verified: boolean };
    },
    onSuccess: () => {
      toast({ title: "VERIFIED", description: "Email verified successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "VERIFICATION FAILED", description: error.message, variant: "destructive" });
    },
  });
}

export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await fetch(apiUrl(api.auth.forgotPassword.path), {
        method: api.auth.forgotPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Request failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "OTP SENT", description: "A reset code has been sent to your email." });
    },
    onError: (error: Error) => {
      toast({ title: "ERROR", description: error.message, variant: "destructive" });
    },
  });
}

export function useResetPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const res = await fetch(apiUrl(api.auth.resetPassword.path), {
        method: api.auth.resetPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Password reset failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "PASSWORD RESET", description: "Your password has been updated. Please log in." });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({ title: "RESET ERROR", description: error.message, variant: "destructive" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return () => {
    // Basic logout for cookie-based auth just needs to clear client state + maybe hit an endpoint
    // Assuming backend handles session clear on next request or expiration, but usually we want a logout endpoint
    // For now, we'll just clear client state and redirect
    queryClient.setQueryData([api.user.me.path], null);
    setLocation("/");
    toast({ title: "DISCONNECTED", description: "Session terminated." });
  };
}
