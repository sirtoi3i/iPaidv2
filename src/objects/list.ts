import { User } from './user';
import { Purchase } from './purchase';


export interface PurchaseList {
    name:string;
    purchases:Purchase[];
    users:User[];
}
