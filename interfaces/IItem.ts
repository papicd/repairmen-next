import { IOwner } from './IOwner';
import { IPlace } from './IPlace';
import { IServiceType } from './IServiceType';

/**
 * Base Service interface
 */
export interface IService {
  _id: string;
  name: string;
  description: string;
  price?: number;
  date?: string;
  owner: IOwner;
  place?: IPlace;
  serviceType?: IServiceType;
}

/**
 * Base ServiceRequest interface
 */
export interface IServiceRequest {
  _id: string;
  name: string;
  description: string;
  priceRange?: string;
  date?: string;
  requestOwner: IOwner;
  place?: IPlace;
  serviceType?: IServiceType;
}

/**
 * Service with type discriminator for discriminated unions
 */
export interface IServiceWithType extends IService {
  __type: 'service';
}

/**
 * ServiceRequest with type discriminator for discriminated unions
 */
export interface IServiceRequestWithType extends IServiceRequest {
  __type: 'service-request';
}

/**
 * Union type for all item types (services and service requests)
 */
export type IItem = IServiceWithType | IServiceRequestWithType;
