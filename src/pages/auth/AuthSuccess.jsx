import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '@/features/authSlice';
import SessionManager from '@/utils/sessionManager';
import { API_BASE_URL } from '@/config/apiConfig';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      try {
        // Fetch user profile after Google login
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get user data');
        }

        const data = await response.json();

        if (!data.user) {
          throw new Error('No user data received');
        }

        // Save user data in SessionManager
        SessionManager.saveSession(data.user);

        // Update Redux state with user data
        dispatch(userLoggedIn({ user: data.user }));

        // Show success message
        toast.success('Successfully signed in with Google!');

        // Check if this was a new registration
        const params = new URLSearchParams(location.search);
        const isNewRegistration = params.get('registered') === 'true';

        if (isNewRegistration) {
          toast.success('Account created successfully! Please log in.');
          navigate('/login', { replace: true });
        } else {
          // Existing user - redirect to home
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Google auth error:', error);
        toast.error('Failed to complete sign in');
        navigate('/login', { replace: true });
      }
    };

    // Add a small delay to ensure cookie is set
    const timer = setTimeout(() => {
      handleGoogleSuccess();
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <h1 className="text-2xl font-semibold mb-2">Processing your sign-in...</h1>
        <p className="text-gray-600 dark:text-gray-400">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
