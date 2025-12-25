import { useState, useEffect } from 'react';
import { AuthProvider } from './context/auth-context';
import { ReportsProvider } from './context/reports-context';
import { LoginPage } from './components/login-page';
import { MainApp } from './components/main-app';

function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <AppContent />
      </ReportsProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Blind Guardian System...</p>
        </div>
      </div>
    );
  }

  return <MainApp />;
}

export default App;
