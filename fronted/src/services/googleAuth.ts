import type { SocialAuthResult } from './types';

// Simple interfaces without conflicts
interface GoogleTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
}

interface GoogleTokenClient {
  requestAccessToken: () => void;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in?: string | number;
  scope?: string;
  token_type?: string;
}

interface GoogleAuthWindow extends Window {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient: (config: GoogleTokenClientConfig) => GoogleTokenClient;
        revoke: (accessToken: string, callback?: () => void) => void;
      };
    };
  };
}

declare global {
  interface Window {
    googleAuthService?: GoogleAuthService;
  }
}

class GoogleAuthService {
  private clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private tokenClient: GoogleTokenClient | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.clientId) {
      throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.');
    }

    await this.loadGoogleScript();
    this.initializeTokenClient();
    this.isInitialized = true;
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const googleWindow = window as GoogleAuthWindow;
      if (googleWindow.google?.accounts?.oauth2) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google GSI client'));

      document.head.appendChild(script);
    });
  }

  private initializeTokenClient(): void {
    const googleWindow = window as GoogleAuthWindow;
    
    if (!googleWindow.google?.accounts?.oauth2) {
      throw new Error('Google OAuth2 client not available');
    }

    this.tokenClient = googleWindow.google.accounts.oauth2.initTokenClient({
      client_id: this.clientId!,
      scope: 'openid email profile',
      callback: this.handleTokenResponse.bind(this)
    });
  }

  private resolveSignIn!: (result: SocialAuthResult) => void;

  private async handleTokenResponse(response: GoogleTokenResponse): Promise<void> {
    try {
      if (!response.access_token) {
        throw new Error('No access token received');
      }

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userInfo = await userInfoResponse.json();

      const userData = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: 'google' as const
      };

      this.resolveSignIn({ success: true, user: userData });
    } catch (error) {
      this.resolveSignIn({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process Google authentication' 
      });
    }
  }

  async signIn(): Promise<SocialAuthResult> {
    try {
      await this.initialize();

      if (!this.tokenClient) {
        throw new Error('Token client not initialized');
      }

      return new Promise((resolve) => {
        this.resolveSignIn = resolve;
        this.tokenClient!.requestAccessToken();
      });

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Google authentication failed' 
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      const googleWindow = window as GoogleAuthWindow;
      if (googleWindow.google?.accounts?.oauth2?.revoke) {
        // Revoke all tokens (empty string revokes all tokens for this client)
        googleWindow.google.accounts.oauth2.revoke('', () => {
          console.log('Google tokens revoked');
        });
      }
      
      // Reset local state
      this.tokenClient = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Error during Google sign out:', error);
    }
  }

}

export const googleAuthService = new GoogleAuthService();

if (typeof window !== 'undefined') {
  window.googleAuthService = googleAuthService;
}
