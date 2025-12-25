import { Shield, Bell, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useState } from 'react';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return null;

  const roleColors = {
    admin: 'text-red-400',
    'soc-analyst': 'text-blue-400',
    pentester: 'text-purple-400',
    client: 'text-emerald-400',
  };

  const roleLabels = {
    admin: 'Administrator',
    'soc-analyst': 'SOC Analyst',
    pentester: 'Penetration Tester',
    client: 'Client',
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 backdrop-blur-sm bg-slate-900/95">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">Blind Guardian System</h1>
            <p className="text-xs text-slate-400">ZeroSight Security Operations Center</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-750 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-slate-950" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className={`text-xs ${roleColors[user.role]}`}>
                  {roleLabels[user.role]}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-750 rounded transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-750 rounded transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
