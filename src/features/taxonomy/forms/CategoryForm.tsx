import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { AddCategory } from '@/features/taxonomy/types';

type CategoryFormProps = {
  category?: AddCategory;
  onSubmit: (formData: FormData) => void;
};

export const CategoryForm = ({ category, onSubmit }: CategoryFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCategory>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: category?.name,
      description: category?.description,
    },
  });

  const handleFormSubmit = (data: AddCategory) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);

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
        <Label htmlFor='name'>Category name</Label>
        <Input
          type='text'
          id='name'
          placeholder='Enter the category name'
          {...register('name', { required: 'This field is required' })}
        />
        {errors.name && (
          <div className='text-red-500'>{errors.name.message}</div>
        )}
      </div>

      <div>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          placeholder='Enter the category description'
          {...register('description', { required: 'This field is required' })}
        />
        {errors.description && (
          <div className='text-red-500'>{errors.description.message}</div>
        )}
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
