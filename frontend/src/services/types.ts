export interface SocialUser {
  id: string;
  email: string;
  name: string;
  provider: 'google' | 'github' | 'apple';
}

export interface SocialAuthResult {
  success: boolean;
  user?: SocialUser;
  error?: string;
}
