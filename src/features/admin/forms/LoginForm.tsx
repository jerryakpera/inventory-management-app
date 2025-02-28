import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { publicApiClient } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

type LoginFormType = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const loginRequest = async (formData: LoginFormType) => {
    await publicApiClient.post('/token/', formData);
  };

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (formData: LoginFormType) => loginRequest(formData),
    onError: (error) => {
      setRequestError(error.message);
    },
    onSuccess: () => {
      toast.success('Logged in successfully');
      navigate('/');
    },
  });

  const handleFormSubmit = async (formData: LoginFormType) => {
    await loginMutation.mutateAsync(formData);
  };

  return (
    <form
      {...props}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn('flex flex-col gap-6', className)}
    >
      <Toaster />
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>Login to your account</h1>

        <p className='text-balance text-sm text-muted-foreground'>
          Enter your email below to login to your account
        </p>

        {requestError && (
          <Alert
            variant='destructive'
            className='text-left'
          >
            <AlertDescription>{requestError}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            autoFocus
            id='email'
            type='email'
            placeholder='m@example.com'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <span className='text-xs text-red-500'>
              {typeof errors.email.message === 'string'
                ? errors.email.message
                : ''}
            </span>
          )}
        </div>
        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='password'>Password</Label>
            <a
              href='#'
              className='ml-auto text-sm underline-offset-4 hover:underline'
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id='password'
            type='password'
            {...register('password', {
              required: 'Password is required',
            })}
          />
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={loginMutation.isPending || isSubmitting}
        >
          Login
        </Button>
      </div>
    </form>
  );
}
