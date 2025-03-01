import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/features/admin/layout/components';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';

import { useAuthApi } from '@/hooks/use-auth-api';
import { ModeToggle } from '@/components/theme/ModeToggle';

export default function Page() {
  const navigate = useNavigate();
  const authApiClient = useAuthApi();

  const fetchUser = async () => {
    const response = await authApiClient.get('/v1/users/me/');
    return response.data;
  };

  useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 h-4'
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className='px-4'>
            <ModeToggle />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='w-full'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
