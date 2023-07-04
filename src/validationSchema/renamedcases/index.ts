import * as yup from 'yup';

export const renamedcaseValidationSchema = yup.object().shape({
  details: yup.string().required(),
  lawfirm_id: yup.string().nullable().required(),
});
