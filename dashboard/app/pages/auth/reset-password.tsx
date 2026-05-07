import { useActionState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

// Define the form schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Mock server action for resetting password
async function resetPasswordAction(prevState: any, formData: FormData) {
  'use server';
  try {
    // In a real app, you would update the user's password in the database
    const password = formData.get('password');
    const mobileNumber = formData.get('mobileNumber');
    
    // Mock success response
    return { 
      success: true, 
      message: "Password reset successfully" 
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Failed to reset password. Please try again." 
    };
  }
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mobileNumber = searchParams.get('mobile') || '';
  
  const [state, formAction] = useActionState(resetPasswordAction, null);
  
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // If password is reset successfully, navigate to login page
  if (state?.success) {
    setTimeout(() => {
      navigate('/auth/login');
    }, 2000); // Show success message for 2 seconds before redirecting
  }

  // Function to handle form submission with mobile number
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('mobileNumber', mobileNumber);
    formAction(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="text-muted-foreground mt-2">Create a new password for your account</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
              
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              
              {state?.success && (
                <p className="text-sm text-green-600">{state.message}</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}