export const AuthService = {
  isLoggedUser(): boolean {
    if (typeof window === "undefined") return false;

    const cookies = document.cookie;
    return cookies.includes("token=");
  },
};
