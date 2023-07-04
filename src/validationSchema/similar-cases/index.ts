import * as yup from 'yup';

export const similarCaseValidationSchema = yup.object().shape({
  link: yup.string().required(),
  summary: yup.string().required(),
  case_id: yup.string().nullable().required(),
});
