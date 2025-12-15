import { useEffect, useState } from 'react';
import { Save, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { getConfig } from '../services/api';
import type { ConfigSetting } from '../types';

export function SettingsPage() {
  const [config, setConfig] = useState<ConfigSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState('13234');
  const [useSecure, setUseSecure] = useState(false);
  const [verifyTls, setVerifyTls] = useState(true);
  const [showApiModal, setShowApiModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const configData = await getConfig();
      setConfig(configData.settings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-brand-text">Settings</h1>
        <p className="text-brand-text-muted">Manage your application preferences</p>
      </div>

      {/* Configuration Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-text">Configuration</h2>
            <p className="text-sm text-brand-text-muted">Application settings from database</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-brand-surface hover:bg-brand-border rounded-lg text-brand-text transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-text-muted">Loading settings...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {config.map((setting) => (
              <div
                key={setting.key}
                className="flex items-center gap-4 p-4 rounded-lg border border-brand-border hover:bg-brand-surface/30 transition-colors"
              >
                <SettingsIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-brand-text font-medium">{setting.key}</p>
                    <span className="text-xs font-mono px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                      {setting.value}
                    </span>
                  </div>
                  <p className="text-xs text-brand-text-muted mt-1">{setting.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-text">API Connection</h2>
          <button
            onClick={() => setShowApiModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-brand-text-muted">Backend API</p>
            <p className="text-sm font-mono text-brand-text">
              {useSecure ? 'https' : 'http'}://{host}:{port}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-text-muted">WebSocket</p>
            <p className="text-sm font-mono text-brand-text">
              {useSecure ? 'wss' : 'ws'}://{host}:{port}/ws
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full border border-brand-border shadow-2xl">
            <h3 className="text-2xl font-bold text-brand-text mb-4">API Configuration</h3>
            
            <div className="space-y-4">
              {/* Host and Port */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    Host
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full px-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text focus:outline-none focus:border-blue-500"
                    placeholder="127.0.0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full px-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text focus:outline-none focus:border-blue-500"
                    placeholder="13234"
                  />
                </div>
              </div>

              {/* Security Options */}
              <div className="space-y-3 pt-2 border-t border-brand-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-brand-text font-medium">Use HTTPS/WSS</p>
                    <p className="text-xs text-brand-text-muted">
                      Enable secure connections
                    </p>
                  </div>
                  <label className="relative inline-block w-12 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useSecure}
                      onChange={(e) => setUseSecure(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-brand-border peer-checked:bg-blue-500 rounded-full peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {useSecure && (
                  <div className="flex items-center justify-between pl-4 border-l-2 border-blue-500/30">
                    <div>
                      <p className="text-brand-text font-medium">Verify TLS</p>
                      <p className="text-xs text-brand-text-muted">
                        Validate certificates
                      </p>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verifyTls}
                        onChange={(e) => setVerifyTls(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-brand-border peer-checked:bg-blue-500 rounded-full peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="pt-3 border-t border-brand-border">
                <p className="text-xs text-brand-text-muted mb-2">Preview:</p>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-brand-text">
                    {useSecure ? 'https' : 'http'}://{host}:{port}
                  </p>
                  <p className="text-xs font-mono text-brand-text">
                    {useSecure ? 'wss' : 'ws'}://{host}:{port}/ws
                  </p>
                </div>
                {useSecure && !verifyTls && (
                  <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded">
                    <p className="text-xs text-orange-400">
                      ⚠️ TLS verification disabled
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApiModal(false)}
                className="flex-1 px-4 py-2 bg-brand-surface hover:bg-brand-border text-brand-text rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowApiModal(false);
                  // TODO: Save settings to localStorage or backend
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Settings */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-brand-text mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-text font-medium">Auto-refresh Dashboard</p>
              <p className="text-sm text-brand-text-muted">
                Automatically refresh charts periodically
              </p>
            </div>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={localStorage.getItem('autoRefreshDashboard') !== 'false'}
                onChange={(e) => {
                  localStorage.setItem('autoRefreshDashboard', String(e.target.checked));
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-brand-border peer-checked:bg-blue-500 rounded-full peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-text font-medium">Refresh Interval</p>
              <p className="text-sm text-brand-text-muted">
                Time between data refreshes (seconds)
              </p>
            </div>
            <input
              type="number"
              min="5"
              max="300"
              defaultValue={localStorage.getItem('refreshInterval') || '30'}
              onChange={(e) => {
                const value = Math.max(5, Math.min(300, parseInt(e.target.value) || 30));
                localStorage.setItem('refreshInterval', String(value));
              }}
              className="w-20 px-3 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-brand-text font-medium">Show Empty Categories</p>
              <p className="text-sm text-brand-text-muted">
                Display categories with no activity
              </p>
            </div>
            <label className="relative inline-block w-12 h-6 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={localStorage.getItem('showEmptyCategories') === 'true'}
                onChange={(e) => {
                  localStorage.setItem('showEmptyCategories', String(e.target.checked));
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-brand-border peer-checked:bg-blue-500 rounded-full peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => alert('Settings saved! (This is a demo - settings are not persisted)')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
