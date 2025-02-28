import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [devResetLink, setDevResetLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDevResetLink(""); // Clear previous link

    try {
      const response = await axios.post("/api/v1/user/password-reset/request", { email });
      if (response.data.devLink) {
        setDevResetLink(response.data.devLink);
        toast.success("Reset link generated (Development Mode)");
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Development Mode Reset Link */}
              {devResetLink && (
                <div className="mt-4 p-4 border-2 border-yellow-500 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500 text-yellow-950 text-xs font-bold px-2 py-1 rounded">
                      DEV MODE
                    </span>
                    <h3 className="font-semibold">Password Reset Link:</h3>
                  </div>
                  <div className="bg-black/5 p-3 rounded">
                    <a
                      href={devResetLink}
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {devResetLink}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
