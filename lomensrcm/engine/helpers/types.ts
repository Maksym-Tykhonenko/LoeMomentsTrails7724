export type MainTabKey = 'Explore' | 'Map' | 'Photo Hunt' | 'Sketch Studio' | 'Settings';

export type LocationItem = {
  id: number;
  name: string;
  title: string;
  coords: [number, number];
  location: string;
  tags: string[];
  description: string;
  image: any;
};

export type MySpot = {
  id: string;
  title: string;
  place: string;
  note: string;
  tags: string[];
  imageUri?: string;
  latitude?: number;
  longitude?: number;
};

export type PhotoEntry = {
  id: string;
  challengeTitle: string;
  uri: string;
  createdAt: number;
};

export type SketchEntry = {
  id: string;
  sourceName: string;
  createdAt: number;
  pointsCount: number;
  previewUri?: string;
  previewImage?: number;
};

export type AppSettings = {
  notifications: boolean;
  haptics: boolean;
  autoSaveSketches: boolean;
};
