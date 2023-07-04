import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSimilarCaseById, updateSimilarCaseById } from 'apiSdk/similar-cases';
import { Error } from 'components/error';
import { similarCaseValidationSchema } from 'validationSchema/similar-cases';
import { SimilarCaseInterface } from 'interfaces/similar-case';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { RenamedcaseInterface } from 'interfaces/renamedcase';
import { getRenamedcases } from 'apiSdk/renamedcases';

function SimilarCaseEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SimilarCaseInterface>(
    () => (id ? `/similar-cases/${id}` : null),
    () => getSimilarCaseById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SimilarCaseInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSimilarCaseById(id, values);
      mutate(updated);
      resetForm();
      router.push('/similar-cases');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SimilarCaseInterface>({
    initialValues: data,
    validationSchema: similarCaseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Similar Case
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="link" mb="4" isInvalid={!!formik.errors?.link}>
              <FormLabel>Link</FormLabel>
              <Input type="text" name="link" value={formik.values?.link} onChange={formik.handleChange} />
              {formik.errors.link && <FormErrorMessage>{formik.errors?.link}</FormErrorMessage>}
            </FormControl>
            <FormControl id="summary" mb="4" isInvalid={!!formik.errors?.summary}>
              <FormLabel>Summary</FormLabel>
              <Input type="text" name="summary" value={formik.values?.summary} onChange={formik.handleChange} />
              {formik.errors.summary && <FormErrorMessage>{formik.errors?.summary}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<RenamedcaseInterface>
              formik={formik}
              name={'case_id'}
              label={'Select Renamedcase'}
              placeholder={'Select Renamedcase'}
              fetcher={getRenamedcases}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.details}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'similar_case',
    operation: AccessOperationEnum.UPDATE,
  }),
)(SimilarCaseEditPage);
