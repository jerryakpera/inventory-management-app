import { useForm } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { Product } from '@/features/products/types';
import { AddProductVariant, ProductVariant } from '@/features/variants/types';
import { ProductCombobox } from '@/features/products/forms';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

type ProductVariantFormProps = {
  products: Product[];
  variant?: ProductVariant;
  onSubmit: (formData: FormData) => void;
};

export const ProductVariantForm = ({
  variant,
  products,
  onSubmit,
}: ProductVariantFormProps) => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddProductVariant>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      size: variant?.size,
      price: variant?.price,
      brand: variant?.brand,
      flavor: variant?.flavor,
      is_active: variant?.is_active,
      description: variant?.description || '',
    },
  });

  useEffect(() => {
    if (variant && variant.product) {
      setSelectedProductId(variant.product.id);
    }
  }, [variant]);

  const handleFormSubmit = (data: AddProductVariant) => {
    const formData = new FormData();

    console.log(data.is_active);

    formData.append('size', data.size);
    formData.append('price', data.price);
    formData.append('brand', data.brand || '');
    formData.append('flavor', data.flavor || '');
    formData.append('description', data.description || '');
    formData.append('is_active', data.is_active ? 'true' : 'false');
    formData.append('product', selectedProductId?.toString() || '');

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
      <div className='flex flex-col space-y-1'>
        <Label htmlFor='product'>Product</Label>
        <ProductCombobox
          products={products}
          selectedId={selectedProductId}
          onSelect={setSelectedProductId}
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='size'>Size</Label>
          <Input
            placeholder='250, 1000'
            {...register('size', {
              required: 'The product size is required',
              minLength: {
                value: 3,
                message: 'The product size should be at least 3 characters',
              },
            })}
          />
          {errors.size && (
            <div className='text-xs text-red-500 font-medium'>
              {errors.size.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='price'>Price (Ngn)</Label>
          <Input
            min={0}
            type='number'
            placeholder='1000'
            {...register('price', {
              required: 'The product price is required',
              minLength: {
                value: 3,
                message: 'The product price should be at least 3 characters',
              },
            })}
          />
          {errors.price && (
            <div className='text-xs text-red-500 font-medium'>
              {errors.price.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='brand'>Brand</Label>
          <Input
            placeholder='Name of brand that produces the product'
            {...register('brand')}
          />
          {errors.brand && (
            <div className='text-xs text-red-500 font-medium'>
              {errors.brand.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='flavor'>Flavor</Label>
          <Input
            placeholder='Name of flavor that produces the product'
            {...register('flavor')}
          />
          {errors.flavor && (
            <div className='text-xs text-red-500 font-medium'>
              {errors.flavor.message}
            </div>
          )}
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
          readOnly
          id='image'
          type='file'
          className='cursor-pointer'
          accept='image/jpeg, image/png, image/webp'
          {...register('image')}
        />
      </div>

      <div className='items-top flex space-x-2'>
        <Checkbox
          id='is_active'
          checked={!!watch('is_active')}
          onCheckedChange={(checked) => setValue('is_active', !!checked)}
        />
        <div className='grid gap-1.5 leading-none'>
          <label
            htmlFor='is_active'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Is active
          </label>
          <p className='text-sm text-muted-foreground'>
            Activate the variant to make it available for sale
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
          disabled={!isValid}
          className='text-white'
        >
          Save
        </Button>
      </div>
    </form>
  );
};
