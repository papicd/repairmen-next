import { IPlace } from './IPlace';
import { IServiceType } from './IServiceType';

/**
 * Extended User interface for profile pages - includes all user-related fields
 */
export interface IUserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  place?: IPlace;
  serviceType?: IServiceType[];
  isServiceProvider?: boolean;
  isAdmin?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
