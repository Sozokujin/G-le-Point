//Store types
export interface AuthStore {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthChecking: boolean;
  login: (user: FirebaseUser) => void;
  logout: () => void;
}


export interface Marker {
    name: string;
    description: string | null;
    tags: string[];
    address: string | null;
    latitude: number;
    longitude: number;
    user: {
      uid: string | null;
      displayName: string | null;
    };
  }

export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null | undefined;
}