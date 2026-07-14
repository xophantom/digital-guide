export type PlaceCategory =
  | "restaurant" | "attraction" | "pharmacy" | "market" | "hospital";
export type Coordinates = { lat: number; lon: number };
export type Place = {
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  distanceMeters: number;
};
export type NearbyPlaces = {
  restaurants: Place[];
  attractions: Place[];
  pharmacies: Place[];
  markets: Place[];
  hospitals: Place[];
};
