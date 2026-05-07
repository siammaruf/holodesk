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
const verifyOTPSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP must not exceed 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits")
});

type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

// Mock server action for verifying OTP
async function verifyOTPAction(prevState: any, formData: FormData) {
  'use server';
  try {
    // In a real app, you would validate the OTP against what was sent
    const otp = formData.get('otp');
    const mobileNumber = formData.get('mobileNumber');
    
    // For demo purposes, any OTP is valid
    // In a real app, you would verify the OTP against what was sent
    
    // Mock success response
    return { 
      success: true, 
      message: "OTP verified successfully",
      mobileNumber 
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Invalid OTP. Please try again." 
    };
  }
}

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mobileNumber = searchParams.get('mobile') || '';
  
  const [state, formAction] = useActionState(verifyOTPAction, null);
  
  const form = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  // If OTP is verified successfully, navigate to reset password page
  if (state?.success) {
    navigate(`/auth/reset-password?mobile=${state.mobileNumber}`);
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
          <h2 className="text-3xl font-bold">Verify OTP</h2>
          <p className="text-muted-foreground mt-2">Enter the verification code sent to {mobileNumber}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Verify OTP
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