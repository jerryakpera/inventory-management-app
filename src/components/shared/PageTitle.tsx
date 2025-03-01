import { Badge } from '@/components/ui/badge';

type PageTitleProps = {
  title?: string;
  tags?: string[];
  subtitle?: string;
};

export const PageTitle = ({ tags, title, subtitle }: PageTitleProps) => {
  return (
    <div>
      {title && <h1 className='text-xl font-bold tracking-wide'>{title}</h1>}
      {subtitle && (
        <h3 className='text-sm text-gray-700 dark:text-gray-300 font-medium'>
          {subtitle}
        </h3>
      )}
      {tags && (
        <div className='flex space-x-2 mt-2'>
          {tags.map((tag) => (
            <Badge
              key={tag}
              className='text-white bg-blue-700 hover:bg-blue-800 duration-75 ease-in-out cursor-pointer'
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
