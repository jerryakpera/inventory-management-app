type PageTitleProps = {
  title?: string;
  subtitle?: string;
};

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <div>
      {title && <h1 className='text-xl font-bold tracking-wide'>{title}</h1>}
      {subtitle && (
        <h3 className='text-sm text-gray-700 dark:text-gray-300 font-medium'>
          {subtitle}
        </h3>
      )}
    </div>
  );
};
