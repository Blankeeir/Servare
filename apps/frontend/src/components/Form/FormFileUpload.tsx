// apps/frontend/src/components/Form/FormFileUpload.tsx
import React from 'react';
import { Control, Controller, FieldValues} from 'react-hook-form';
import { FormControl, FormHelperText } from '@mui/material';
import { Dropzone } from '../Dropzone';

interface FormFileUploadProps {
  name: string;
  control: Control<FieldValues>;
  label: string;
  rules?: object;
  accept?: string[];
  maxSize?: number;
}

export const FormFileUpload: React.FC<FormFileUploadProps> = ({
  name,
  control,
  label,
  rules,
  accept,
  maxSize,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, value },
        fieldState: { error }
      }) => (
        <FormControl fullWidth error={!!error}>
          <Dropzone
            onFileAccepted={onChange}
            acceptedFileTypes={accept}
            maxSize={maxSize}
          />
          {error && (
            <FormHelperText>{error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};