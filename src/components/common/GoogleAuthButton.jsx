import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  triggerGoogleOAuth,
  getGoogleClientId,
  saveGoogleClientId
} from '../../utils/googleAuth';
import { isDisposableEmail } from '../../utils/tempMailDetector';
import { AlertCircle, X, Key, ExternalLink } from 'lucide-react';

const GoogleAuthButton = ({
  text = 'Continue with Google',
  className = '',
  onGoogleVerified = null // If provided, passes verified profile { email, name, avatarUrl } to parent
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(getGoogleClientId());

  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleLaunchGoogle = async () => {
    setError(null);

    const currentClientId = getGoogleClientId();
    if (!currentClientId) {
      setShowConfigModal(true);
      return;
    }

    setIsLoading(true);

    await triggerGoogleOAuth({
      onSuccess: async (googleProfile) => {
        setIsLoading(false);

        // Reject disposable emails even if attempted via Google
        if (isDisposableEmail(googleProfile.email)) {
          setError(
            'Disposable and temporary email addresses are not permitted on StudentForge.'
          );
          return;
        }

        // If parent provided an onGoogleVerified handler (e.g. in Register.jsx)
        if (onGoogleVerified) {
          onGoogleVerified(googleProfile);
          return;
        }

        // Default: Login flow
        const result = await googleLogin(googleProfile);
        if (result.success) {
          navigate('/dashboard');
        } else if (result.isNewUser) {
          // Unregistered user! Redirect to /register to enter university details
          navigate('/register', { state: { googleProfile } });
        } else {
          setError(result.error || 'Failed to authenticate with Google.');
        }
      },
      onError: (err) => {
        setIsLoading(false);
        if (err.code === 'MISSING_CLIENT_ID') {
          setShowConfigModal(true);
        } else {
          setError(err.message || 'Google Sign-In was cancelled or failed.');
        }
      }
    });
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!clientIdInput.trim()) {
      setError('Please provide a valid Google Client ID.');
      return;
    }

    saveGoogleClientId(clientIdInput.trim());
    setShowConfigModal(false);
    setError(null);
    // Automatically trigger Google sign in with the saved ID
    setTimeout(() => {
      handleLaunchGoogle();
    }, 200);
  };

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleLaunchGoogle}
          className={`w-full py-3 px-4 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-600 text-slate-200 font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
          {isLoading ? (
            <span className="h-4 w-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></span>
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isLoading ? 'Opening Google Account Picker...' : text}</span>
        </button>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Google Cloud Client ID Configuration Dialog if missing */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl shadow-2xl relative space-y-5 border border-slate-700 animate-scale-up">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <div className="inline-flex p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
                <Key size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Google OAuth Client ID Required</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                To launch the official Google Account Selector popup, enter your Google OAuth 2.0 Client ID (from{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 underline inline-flex items-center gap-0.5"
                >
                  Google Cloud Console <ExternalLink size={10} />
                </a>
                ).
              </p>
            </div>

            <form onSubmit={handleSaveClientId} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Client ID (.apps.googleusercontent.com)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  className="glass-input w-full px-3 py-2.5 rounded-xl text-xs font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Make sure <code>http://localhost:5173</code> is added under Authorized JavaScript origins.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-semibold cursor-pointer border border-black"
                >
                  Save & Connect Google
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
