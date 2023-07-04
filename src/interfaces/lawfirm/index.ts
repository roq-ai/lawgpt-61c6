import { RenamedcaseInterface } from 'interfaces/renamedcase';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface LawfirmInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  Renamedcase?: RenamedcaseInterface[];
  user?: UserInterface;
  _count?: {
    Renamedcase?: number;
  };
}

export interface LawfirmGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
