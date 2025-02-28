import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Failed to sign in with Google');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Authentication Failed</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't complete the sign-in process. Please try again.
        </p>
        <Button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          Return to Login
        </Button>
      </div>
    </div>
  );
};

export default AuthFailure;
