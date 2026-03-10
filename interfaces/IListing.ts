import { Types } from "mongoose";
import { IPlace } from "./IPlace";
import { IServiceType } from "./IServiceType";
import { IUser } from "./IUser";

export type ListingType = "offer" | "demand";

/**
 * Listing interface - represents a unified listing that can be either an offer or demand
 */
export interface IListing {
  _id: string;
  name: string;
  description: string;
  owner: Types.ObjectId | IUser;
  place: Types.ObjectId | IPlace;
  serviceType: Types.ObjectId | IServiceType;
  priceRange?: string;
  date?: Date;
  type: ListingType;
  closed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Listing with populated references
 */
export interface IListingPopulated {
  _id: string;
  name: string;
  description: string;
  owner: IUser;
  place: IPlace;
  serviceType: IServiceType;
  priceRange?: string;
  date?: Date;
  type: ListingType;
  closed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
