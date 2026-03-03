// Reusable interfaces for the RepairMan app

export type { IOwner } from './IOwner';
export type { IPlace } from './IPlace';
export type { IServiceType } from './IServiceType';
export type { IUser } from './IUser';
export type { IUserProfile } from './IUserProfile';

// Item types with discriminated unions
export type {
  IService,
  IServiceRequest,
  IServiceWithType,
  IServiceRequestWithType,
  IItem
} from './IItem';
