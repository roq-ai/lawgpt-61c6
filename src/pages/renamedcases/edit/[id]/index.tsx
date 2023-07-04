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
import { getRenamedcaseById, updateRenamedcaseById } from 'apiSdk/renamedcases';
import { Error } from 'components/error';
import { renamedcaseValidationSchema } from 'validationSchema/renamedcases';
import { RenamedcaseInterface } from 'interfaces/renamedcase';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { LawfirmInterface } from 'interfaces/lawfirm';
import { getLawfirms } from 'apiSdk/lawfirms';

function RenamedcaseEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RenamedcaseInterface>(
    () => (id ? `/renamedcases/${id}` : null),
    () => getRenamedcaseById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RenamedcaseInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRenamedcaseById(id, values);
      mutate(updated);
      resetForm();
      router.push('/renamedcases');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RenamedcaseInterface>({
    initialValues: data,
    validationSchema: renamedcaseValidationSchema,
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
            Edit Renamedcase
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
            <FormControl id="details" mb="4" isInvalid={!!formik.errors?.details}>
              <FormLabel>Details</FormLabel>
              <Input type="text" name="details" value={formik.values?.details} onChange={formik.handleChange} />
              {formik.errors.details && <FormErrorMessage>{formik.errors?.details}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<LawfirmInterface>
              formik={formik}
              name={'lawfirm_id'}
              label={'Select Lawfirm'}
              placeholder={'Select Lawfirm'}
              fetcher={getLawfirms}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
    entity: 'Renamedcase',
    operation: AccessOperationEnum.UPDATE,
  }),
)(RenamedcaseEditPage);
