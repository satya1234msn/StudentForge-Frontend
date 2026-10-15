export const DEFAULT_GOOGLE_CLIENT_ID =
  '657552875502-h0tmrbte79besbgt8pdta25pj8j0au1p.apps.googleusercontent.com';

export function getGoogleClientId() {
  return (
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem('STUDENTFORGE_GOOGLE_CLIENT_ID') ||
    DEFAULT_GOOGLE_CLIENT_ID
  );
}

export function saveGoogleClientId(clientId) {
  if (clientId) {
    localStorage.setItem('STUDENTFORGE_GOOGLE_CLIENT_ID', clientId.trim());
  }
}

/**
 * Ensures Google Identity Services SDK is loaded
 */
export function ensureGoogleScriptLoaded() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
      return resolve(true);
    }

    const existing = document.getElementById('gsi-client-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Triggers authentic Google Account Selector popup via Google OAuth2 Token Client
 * Returns verified Google profile details { email, name, avatarUrl, emailVerified, googleId }
 */
export async function triggerGoogleOAuth({ onSuccess, onError }) {
  await ensureGoogleScriptLoaded();

  const clientId = getGoogleClientId();

  if (!clientId) {
    if (onError) onError({ code: 'MISSING_CLIENT_ID', message: 'Google Client ID not configured.' });
    return;
  }

  if (!window.google?.accounts?.oauth2) {
    if (onError) onError({ code: 'SDK_NOT_LOADED', message: 'Google Identity Services SDK failed to load.' });
    return;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          if (onError) {
            onError({
              code: tokenResponse.error,
              message: tokenResponse.error_description || tokenResponse.error
            });
          }
          return;
        }

        try {
          // Fetch authenticated and verified profile directly from Google servers
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });

          if (!res.ok) {
            throw new Error('Failed to retrieve user profile from Google.');
          }

          const profile = await res.json();

          if (!profile.email) {
            throw new Error('Google did not return an email address.');
          }

          if (onSuccess) {
            onSuccess({
              email: profile.email,
              name: profile.name || profile.email.split('@')[0],
              avatarUrl: profile.picture || null,
              emailVerified: profile.email_verified || true,
              googleId: profile.sub
            });
          }
        } catch (fetchErr) {
          if (onError) onError({ code: 'PROFILE_FETCH_FAILED', message: fetchErr.message });
        }
      }
    });

    tokenClient.requestAccessToken();
  } catch (err) {
    if (onError) onError({ code: 'CLIENT_INIT_FAILED', message: err.message });
  }
}
