import { AuthProvider } from './contexts/AuthContext'; // Ensure useAuth is exported
import { LoginPage } from './pages/LoginPage';
import { MainStoryScreen } from './pages/MainStoryScreen';
import { useAuth } from './hooks/useAuth';
function AppContent() {
  const {
    isAuthenticated,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfbf7]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      </div>;
  }
  return isAuthenticated ? <MainStoryScreen /> : <LoginPage />;
}
export function App() {
  return <AuthProvider>
      <AppContent />
    </AuthProvider>;
}