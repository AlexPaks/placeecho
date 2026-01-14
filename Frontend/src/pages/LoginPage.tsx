import { motion } from 'framer-motion';
import { MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
export function LoginPage() {
  const authContext = useAuth(); // Ensure authContext is properly defined
  const {
    loading
  } = authContext;

  const handleLogin = async () => {
    if (authContext) {
      await authContext.login(); // Call login without arguments
    }
  };

  return <div className="min-h-screen w-full bg-[#fdfbf7] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-secondary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-40"></div>
      </div>

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8,
      ease: 'easeOut'
    }} className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 200
        }} className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl shadow-xl flex items-center justify-center transform rotate-3">
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div initial={{
          scale: 0,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          delay: 0.5,
          type: 'spring'
        }} className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.h1 initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="text-4xl font-serif font-bold text-stone-900 mb-3">
          Story Explorer
        </motion.h1>

        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.6
      }} className="text-lg text-stone-600 mb-12 font-light">
          Discover the hidden stories of the world around you.
        </motion.p>

        {/* Login Button */}
        <motion.button initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} onClick={handleLogin} disabled={authContext?.loading} className="w-full bg-white border border-stone-200 hover:border-stone-300 text-stone-700 font-medium py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-3 group relative overflow-hidden">
          {loading ? <span className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></span> : <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            </>}
        </motion.button>

        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1
      }} className="mt-8 text-xs text-stone-400">
          By continuing, you agree to our Terms & Privacy Policy.
        </motion.p>
      </motion.div>
    </div>;
}