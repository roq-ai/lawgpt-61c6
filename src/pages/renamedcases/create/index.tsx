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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRenamedcase } from 'apiSdk/renamedcases';
import { Error } from 'components/error';
import { renamedcaseValidationSchema } from 'validationSchema/renamedcases';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { LawfirmInterface } from 'interfaces/lawfirm';
import { getLawfirms } from 'apiSdk/lawfirms';
import { RenamedcaseInterface } from 'interfaces/renamedcase';

function RenamedcaseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RenamedcaseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRenamedcase(values);
      resetForm();
      router.push('/renamedcases');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RenamedcaseInterface>({
    initialValues: {
      details: '',
      lawfirm_id: (router.query.lawfirm_id as string) ?? null,
    },
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
            Create Renamedcase
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(RenamedcaseCreatePage);
