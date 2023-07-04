import { RenamedcaseInterface } from 'interfaces/renamedcase';
import { GetQueryInterface } from 'interfaces';

export interface SimilarCaseInterface {
  id?: string;
  link: string;
  summary: string;
  case_id: string;
  created_at?: any;
  updated_at?: any;

  Renamedcase?: RenamedcaseInterface;
  _count?: {};
}

export interface SimilarCaseGetQueryInterface extends GetQueryInterface {
  id?: string;
  link?: string;
  summary?: string;
  case_id?: string;
}
