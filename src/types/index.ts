//Store types
export interface UserStore {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser) => void;
  clearUser: () => void;
}

export interface Marker {
  id: string;
  name: string;
  description: string | null;
  tags: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  visibiltyStatus: string | null; // public / friend / groups
  createdAt: number;
  user: {
    uid: string | null;
    username: string | null;
  };
}

export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null | undefined;
  bio: string | null;
  username: string | null;
}

export interface FriendRequest {
  uid: string;
  from: string;
  to: string;
  status: "pending" | "accepted" | "rejected";
}

export interface Group {
  id: string;
  name: string;
  groupOwner: string;
  members: string[];
  markers: {
    idMarker: string;
    idUser: string;
  };
}
