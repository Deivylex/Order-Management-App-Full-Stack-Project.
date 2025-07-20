import type { SocialAuthResult } from './types';

export const githubAuthService = {
  async signIn(): Promise<SocialAuthResult> {
    try {
      console.log('GitHub OAuth - Redirecting to GitHub...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 'github_' + Date.now(),
        email: 'user@github.com',
        name: 'GitHub User',
        provider: 'github' as const
      };
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return { success: false, error: 'GitHub authentication failed' };
    }
  }
};
