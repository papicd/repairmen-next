export interface CurrentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isServiceProvider: boolean;
  isAdmin: boolean;
}

export class UserService {
  static async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      return data.user;
    } catch (error) {
      console.error("Failed to fetch current user", error);
      return null;
    }
  }
}
