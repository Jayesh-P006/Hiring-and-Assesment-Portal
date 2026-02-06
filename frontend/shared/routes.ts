import { z } from "zod";
import { insertUserSchema, users, faceAuthSchema, faceEnrollSchema, verifyFaceSchema, otpSchema, sendOtpSchema, resetPasswordSchema } from "./schema";

export const api = {
  register: "/api/auth/register",
  login: "/api/auth/login",
  faceLogin: "/api/auth/face-login",
  logout: "/api/auth/logout",
  resetFace: "/api/auth/reset-face",
  me: "/api/user/me",
  sendOtp: "/api/auth/send-otp",
  verifyOtp: "/api/auth/verify-otp",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/auth/register",
      input: faceEnrollSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/auth/login",
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    faceLogin: {
      method: "POST" as const,
      path: "/api/auth/face-login",
      input: verifyFaceSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    sendOtp: {
      method: "POST" as const,
      path: "/api/auth/send-otp",
      input: sendOtpSchema,
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
      },
    },
    verifyOtp: {
      method: "POST" as const,
      path: "/api/auth/verify-otp",
      input: otpSchema,
      responses: {
        200: z.object({ message: z.string(), verified: z.boolean() }),
        400: z.object({ message: z.string(), verified: z.boolean() }),
      },
    },
    forgotPassword: {
      method: "POST" as const,
      path: "/api/auth/forgot-password",
      input: z.object({ email: z.string().email() }),
      responses: {
        200: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
    resetPassword: {
      method: "POST" as const,
      path: "/api/auth/reset-password",
      input: resetPasswordSchema,
      responses: {
        200: z.object({ message: z.string() }),
        400: z.object({ message: z.string() }),
      },
    },
  },
  user: {
    me: {
      method: "GET" as const,
      path: "/api/user/me",
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    }
  }
};
