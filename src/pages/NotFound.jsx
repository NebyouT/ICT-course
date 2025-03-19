import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, RefreshCcw } from 'lucide-react';
import { noiseTexture } from '@/components/ui/noise-texture';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-purple-200 dark:bg-purple-800/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-48 -right-48 bg-blue-200 dark:bg-blue-800/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black,transparent)] dark:bg-grid-slate-700/25"
        style={{ 
          backgroundImage: `url(${noiseTexture})`,
          backgroundRepeat: 'repeat',
          opacity: 0.4
        }}
      ></div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            <div className="w-2 h-2 bg-purple-400/20 dark:bg-purple-500/20 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        {/* 404 Number with glitch effect */}
        <div className="relative mb-8 select-none">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 animate-bounce-in">
            404
          </h1>
          <div className="absolute inset-0 animate-glitch-1">
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500 opacity-30 translate-x-[2px] translate-y-[2px]">
              404
            </h1>
          </div>
          <div className="absolute inset-0 animate-glitch-2">
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 opacity-30 -translate-x-[2px] translate-y-[-2px]">
              404
            </h1>
          </div>
        </div>

        {/* Messages */}
        <div className="mt-4 space-y-4 animate-slide-up">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-200">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
            Oops! It seems you've ventured into uncharted territory.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button
            variant="outline"
            className="group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
            onClick={() => navigate(-1)}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative">Go Back</span>
          </Button>
          <Button
            className="group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => navigate('/')}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="relative">Return Home</span>
          </Button>
          <Button
            variant="ghost"
            className="group transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
            <span className="relative">Refresh Page</span>
          </Button>
        </div>

        {/* Decorative rotating ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-spin-slow opacity-30 pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 dark:border-purple-500/10"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 dark:border-blue-500/10 rotate-45"></div>
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 dark:border-indigo-500/10 rotate-90"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
