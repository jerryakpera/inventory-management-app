import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { AddUnit } from '@/features/taxonomy/types';

type UnitFormProps = {
  unit?: AddUnit;
  onSubmit: (formData: AddUnit) => void;
};

export const UnitForm = ({ unit, onSubmit }: UnitFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUnit>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: unit?.name,
      symbol: unit?.symbol,
    },
  });

  return (
    <form
      className='space-y-6'
      encType='multipart/form-data'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor='name'>Unit name</Label>
        <Input
          id='name'
          type='text'
          placeholder='Enter the unit name, eg. Kilogram'
          {...register('name', { required: 'This field is required' })}
        />
        {errors.name && (
          <div className='text-red-500'>{errors.name.message}</div>
        )}
      </div>

      <div>
        <Label htmlFor='symbol'>Unit symbol</Label>
        <Input
          id='symbol'
          type='text'
          placeholder='Enter the unit symbol, eg. kg'
          {...register('symbol', { required: 'This field is required' })}
        />
        {errors.symbol && (
          <div className='text-red-500'>{errors.symbol.message}</div>
        )}
      </div>

      <div className='flex justify-end gap-x-2 items-center'>
        <Button
          type='button'
          variant='destructive'
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='text-white bg-blue-600'
        >
          Save
        </Button>
      </div>
    </form>
  );
};
