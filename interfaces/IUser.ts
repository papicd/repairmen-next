import { Types } from "mongoose";

export interface IUser {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
  place: Types.ObjectId,
  isAdmin: boolean;
  serviceType: Types.ObjectId[],
  phone?: string;
  isServiceProvider?: boolean;
}
