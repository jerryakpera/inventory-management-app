import { capitalize } from 'lodash';
import { useForm } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

import { Category } from '@/features/taxonomy/types';
import { AddProduct, Unit } from '@/features/products/types';

type ProductFormProps = {
  units: Unit[];
  categories: Category[];
  handleFormSubmit: (formData: FormData) => void;
};

export const ProductForm = ({
  units,
  categories,
  handleFormSubmit,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProduct>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = (formData: AddProduct) => {
    const data = new FormData();

    // Append all fields except 'image'
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image') {
        data.append(key, value as string);
      }
    });

    // Handle file input properly
    const fileInput = document.querySelector<HTMLInputElement>(
      'input[name="image"]'
    );
    if (fileInput?.files?.[0]) {
      data.append('image', fileInput.files[0]);
    }

    handleFormSubmit(data);
  };

  return (
    <form
      className='space-y-6'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor='name'>Product name</Label>
        <Input
          placeholder='Almond Seeds'
          {...register('name', {
            required: 'The product name is required',
            minLength: {
              value: 3,
              message: 'The product name should be at least 3 characters',
            },
          })}
        />
        {errors.name && (
          <div className='text-xs text-red-500 font-medium'>
            {errors.name.message}
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          {/* Create an input to capture the unit */}
          <Label htmlFor='unit'>Unit</Label>
          <select
            className='select'
            {...register('unit', {
              required: 'The unit is required',
            })}
          >
            {units &&
              units.map((unit) => (
                <option
                  key={unit.id}
                  value={String(unit.id)}
                  className='bg-gray-900'
                >
                  {`${capitalize(unit.name)} (${unit.symbol})`}
                </option>
              ))}
          </select>
        </div>

        <div>
          <Label htmlFor='category'>Category</Label>
          <select
            {...register('category')}
            className='select'
          >
            {categories &&
              categories.map((category) => (
                <option
                  key={category.id}
                  className='bg-gray-900'
                  value={String(category.id)}
                >
                  {capitalize(category.name)}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          rows={4}
          {...register('description')}
          placeholder='Write a detailed description of the product. Include details on health benefits etc.'
        />
      </div>

      <div>
        <Label htmlFor='image'>Image</Label>
        <Input
          type='file'
          accept='image/jpeg, image/png, image/webp'
          {...register('image')}
        />
      </div>

      <div className='items-top flex space-x-2'>
        <Checkbox
          id='is_active'
          {...register('is_active')}
        />
        <div className='grid gap-1.5 leading-none'>
          <label
            htmlFor='is_active'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Is active
          </label>
          <p className='text-sm text-muted-foreground'>
            Activate the product to make it available for sale
          </p>
        </div>
      </div>

      <div className='w-full flex justify-end gap-4 items-center'>
        <Button
          variant='destructive'
          type='button'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='text-white'
        >
          Save
        </Button>
      </div>
    </form>
  );
};
