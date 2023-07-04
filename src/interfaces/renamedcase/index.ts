import { SimilarCaseInterface } from 'interfaces/similar-case';
import { LawfirmInterface } from 'interfaces/lawfirm';
import { GetQueryInterface } from 'interfaces';

export interface RenamedcaseInterface {
  id?: string;
  details: string;
  lawfirm_id: string;
  created_at?: any;
  updated_at?: any;
  similar_case?: SimilarCaseInterface[];
  lawfirm?: LawfirmInterface;
  _count?: {
    similar_case?: number;
  };
}

export interface RenamedcaseGetQueryInterface extends GetQueryInterface {
  id?: string;
  details?: string;
  lawfirm_id?: string;
}
