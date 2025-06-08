import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'history', label: 'Search History', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || 'User'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>📅 Joined {new Date(user.created_at).toLocaleDateString()}</span>
                <span>🔍 {user.search_count} searches</span>
                {user.last_login && (
                  <span>🕒 Last login {new Date(user.last_login).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="btn-outline">
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ user: any }> = ({ user }) => {
  const stats = [
    { label: 'Total Searches', value: user.search_count, icon: '🔍' },
    { label: 'Account Status', value: user.is_verified ? 'Verified' : 'Unverified', icon: '✅' },
    { label: 'Member Since', value: new Date(user.created_at).getFullYear(), icon: '📅' },
    { label: 'Last Active', value: user.last_login ? 'Recently' : 'Never', icon: '🕒' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">🔍</div>
            <h4 className="font-medium text-gray-900">Start Searching</h4>
            <p className="text-sm text-gray-600">Find new AI tools and resources</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-medium text-gray-900">View History</h4>
            <p className="text-sm text-gray-600">See your past searches</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="text-2xl mb-2">⚙️</div>
            <h4 className="font-medium text-gray-900">Settings</h4>
            <p className="text-sm text-gray-600">Manage your account</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// History Tab Component
const HistoryTab: React.FC = () => {
  const [searchHistory] = useState([
    { id: 1, query: 'ChatGPT alternatives', date: '2024-01-15', results: 12 },
    { id: 2, query: 'React tutorials', date: '2024-01-14', results: 8 },
    { id: 3, query: 'Machine Learning courses', date: '2024-01-13', results: 15 },
    { id: 4, query: 'Design tools', date: '2024-01-12', results: 6 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Search History</h3>
        <button className="btn-outline text-sm">
          Clear History
        </button>
      </div>

      {searchHistory.length > 0 ? (
        <div className="space-y-4">
          {searchHistory.map((search) => (
            <div key={search.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">"{search.query}"</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📅 {search.date}</span>
                    <span>📊 {search.results} results</span>
                  </div>
                </div>
                <button className="btn-primary text-sm">
                  Search Again
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            📝 No search history yet
          </div>
          <p className="text-gray-400">
            Your search history will appear here once you start searching.
          </p>
        </div>
      )}
    </div>
  );
};

// Settings Tab Component
const SettingsTab: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Profile Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="input"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <button className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Password</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="btn-primary">
                Update Password
              </button>
            </div>
          </div>

          <div className="border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 