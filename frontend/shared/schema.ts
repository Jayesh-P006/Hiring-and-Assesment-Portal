import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("candidate"), // candidate, company_admin, company_hr
  // 128-d feature vector stored as JSON array
  faceEmbedding: json("face_embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  faceEmbedding: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Types for API communication
export const faceAuthSchema = z.object({
  username: z.string(),
  image: z.string(), // Base64 encoded image
});

export const userRoleSchema = z.enum(["candidate", "company_admin", "company_hr"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const faceEnrollSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  images: z.array(z.string()), // Array of Base64 images (center, left, right)
  role: userRoleSchema.optional().default("candidate"),
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  purpose: z.enum(['register', 'forgot_password']).optional(),
});

export const sendOtpSchema = z.object({
  email: z.string().email(),
  purpose: z.enum(['register', 'forgot_password']).optional(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export const verifyFaceSchema = z.object({
  image: z.string(), // Base64
});
