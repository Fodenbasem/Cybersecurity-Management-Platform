import { useAuth } from '../context/auth-context';
import { LoginPage } from './login-page';
import { Dashboard } from './dashboard/dashboard';

export function MainApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
