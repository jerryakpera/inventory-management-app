import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { ProductImage, Product } from '@/features/products/types';

type ProductFormProps = {
  product?: Product;
  onSubmit: (formData: FormData) => void;
};

export const ProductImageForm = ({ product, onSubmit }: ProductFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProductImage>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      image: product?.image || '',
    },
  });

  const handleFormSubmit = (data: ProductImage) => {
    const formData = new FormData();

    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    onSubmit(formData);
  };

  return (
    <form
      className='space-y-6'
      encType='multipart/form-data'
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div>
        <Label htmlFor='image'>Product image</Label>
        <Input
          id='image'
          type='file'
          accept='image/*'
          placeholder='Almond Seeds'
          {...register('image', {
            required: 'The image is required',
          })}
        />
        {errors.image && (
          <div className='text-xs text-red-500 font-medium'>
            {errors.image.message}
          </div>
        )}
      </div>

      <div className='w-full flex justify-end gap-4 items-center'>
        <Button
          type='button'
          variant='destructive'
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!isValid}
          className='text-white'
        >
          Save
        </Button>
      </div>
    </form>
  );
};
