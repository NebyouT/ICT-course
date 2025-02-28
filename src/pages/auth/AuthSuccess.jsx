import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '@/features/authSlice';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      try {
        // Fetch user profile after Google login
        const response = await fetch('http://localhost:3000/api/v1/user/profile', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!response.ok) {
          throw new Error('Failed to get user data');
        }

        const data = await response.json();
        
        // Update Redux state with user data
        dispatch(userLoggedIn({ user: data.user }));
        
        // Show success message
        toast.success('Successfully signed in with Google!');
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Google auth error:', error);
        toast.error('Failed to complete sign in');
        navigate('/login');
      }
    };

    handleGoogleSuccess();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <h1 className="text-2xl font-semibold mb-2">Signing you in...</h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
