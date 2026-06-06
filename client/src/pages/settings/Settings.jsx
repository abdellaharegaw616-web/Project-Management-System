import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  Camera,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, api } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    emailAlerts: true,
    language: 'en',
    remindersEnabled: true,
    reminderTiming: '1d'
  });
  const [showRemindersConfig, setShowRemindersConfig] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    loadPreferences();
  }, [user]);

  const loadPreferences = () => {
    const saved = localStorage.getItem('taskflow_preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem('taskflow_preferences', JSON.stringify(newPrefs));
    if (newPrefs.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic client-side validation
      if (!formData.name || !formData.email) {
        toast.error('Name and email are required');
        setLoading(false);
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(formData.email)) {
        toast.error('Please enter a valid email address');
        setLoading(false);
        return;
      }

      const res = await api.put('/auth/me', {
        name: formData.name,
        email: formData.email
      });

      toast.success(res.data?.message || 'Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      const status = error.response?.status;
      const body = error.response?.data;
      const msg = body?.message || (typeof body === 'string' ? body : JSON.stringify(body)) || error.message || 'Failed to update profile';
      toast.error(`${status ? 'Status ' + status + ': ' : ''}${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Change password error:', error);
      const status = error.response?.status;
      const body = error.response?.data;
      const msg = body?.message || (typeof body === 'string' ? body : JSON.stringify(body)) || error.message || 'Failed to update password';
      toast.error(`${status ? 'Status ' + status + ': ' : ''}${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-secondary w-full justify-start ${
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="h-20 w-20 bg-brand-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm border border-gray-200">
                    <Camera className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                  <p className="text-xs text-gray-400 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <form onSubmit={updateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
              
              <form onSubmit={updatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="input pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="input pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showNew ? 'Hide new password' : 'Show new password'}
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Session Management</h3>
                <p className="text-sm text-gray-600 mb-3">Manage your active sessions</p>
                <button className="text-sm text-red-600 hover:text-red-700">
                  Log out from all devices
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications about task updates</p>
                  </div>
                  <button
                    onClick={() => savePreferences({ ...preferences, notifications: !preferences.notifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.notifications ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Email Alerts</p>
                    <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                  </div>
                  <button
                    onClick={() => savePreferences({ ...preferences, emailAlerts: !preferences.emailAlerts })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.emailAlerts ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Task Reminders</p>
                    <p className="text-sm text-gray-500">Get reminders for upcoming deadlines</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => savePreferences({ ...preferences, remindersEnabled: !preferences.remindersEnabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.remindersEnabled ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300'
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <button
                      onClick={() => setShowRemindersConfig(prev => !prev)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-700"
                    >
                      Configure
                    </button>
                  </div>
                </div>
                {showRemindersConfig && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Timing</label>
                    <select
                      value={preferences.reminderTiming}
                      onChange={(e) => savePreferences({ ...preferences, reminderTiming: e.target.value })}
                      className="input w-44"
                    >
                      <option value="1h">1 hour before</option>
                      <option value="3h">3 hours before</option>
                      <option value="6h">6 hours before</option>
                      <option value="12h">12 hours before</option>
                      <option value="1d">1 day before</option>
                      <option value="2d">2 days before</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">Reminders will be sent according to your selected timing.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => savePreferences({ ...preferences, theme: 'light' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.theme === 'light' ? 'border-blue-500 bg-brand-50' : 'border-gray-200'
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <p className="text-sm font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => savePreferences({ ...preferences, theme: 'dark' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.theme === 'dark' ? 'border-blue-500 bg-brand-50' : 'border-gray-200'
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2 text-gray-700" />
                      <p className="text-sm font-medium">Dark</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => savePreferences({ ...preferences, language: e.target.value })}
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

