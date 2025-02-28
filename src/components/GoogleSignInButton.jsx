import React from 'react';
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    window.location.href = 'https://ict-backend-likf.onrender.com/auth/google';
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
