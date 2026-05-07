import { useActionState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
const forgotPasswordSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits")
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Mock server action for sending OTP
async function sendOTPAction(prevState: any, formData: FormData) {
  'use server';
  try {
    // In a real app, you would validate the mobile number and send an OTP
    const mobileNumber = formData.get('mobileNumber');
    
    // Mock success response
    return { 
      success: true, 
      message: `OTP sent to ${mobileNumber}`,
      mobileNumber 
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Failed to send OTP. Please try again." 
    };
  }
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [state, formAction] = useActionState(sendOTPAction, null);
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      mobileNumber: "",
    },
  });

  // If OTP is sent successfully, navigate to verify OTP page
  if (state?.success) {
    // In a real app, you would store the mobile number in a more secure way
    // For demo purposes, we're using URL state
    navigate(`/auth/verify-otp?mobile=${state.mobileNumber}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold">Forgot Password</h2>
          <p className="text-muted-foreground mt-2">Enter your mobile number to receive a verification code</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-4">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Send Verification Code
              </Button>
              
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}