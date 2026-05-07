import { z } from 'zod';
import { loginSchema, registerSchema } from '~/utils/validations/auth';
import type { LoginFormResponse, RegisterFormResponse } from '~/types/api';

export async function loginAction(prevState: unknown, formData: FormData): Promise<LoginFormResponse> {
  'use server';
  try {
    const data = loginSchema.parse(Object.fromEntries(formData));
    return { message: 'Login successful', data };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        errors[String(err.path[0])] = err.message;
      });
      return { error: JSON.stringify(errors) };
    }
    return { error: JSON.stringify({ form: 'Invalid credentials' }) };
  }
}

export async function registerAction(prevState: unknown, formData: FormData): Promise<RegisterFormResponse> {
  'use server';
  try {
    const data = registerSchema.parse(Object.fromEntries(formData));
    return { message: 'Registration successful', data };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        errors[String(err.path[0])] = err.message;
      });
      return { error: JSON.stringify(errors) };
    }
    return { error: JSON.stringify({ form: 'Registration failed' }) };
  }
}