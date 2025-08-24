// User interface for API users (from Identity API)
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;

  // Profile-specific properties (from UserDetails)
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePicture?: string;
  resume?: string;

  // Auth-specific properties (for social login)
  login?: string;
  avatar_url?: string;
  name?: string;
  picture?: string;
}

// For backward compatibility
export default User;
