import React from 'react';
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { toast } from 'sonner';

const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    try {
      // Show loading toast
      toast.loading('Redirecting to Google login...');
      
      // Redirect to the Google authentication endpoint
      window.location.href = 'https://ict-backend-likf.onrender.com/auth/google';
    } catch (error) {
      console.error('Error redirecting to Google login:', error);
      toast.error('Failed to connect to Google login');
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
      type="button"
    >
      <FcGoogle className="h-5 w-5" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
