/**
 * Place interface - represents a geographic location
 */
export interface IPlace {
  _id: string;
  country: string;
  place: string;
  currency?: string;
}
