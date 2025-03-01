import { capitalize } from 'lodash';

import { Category } from '../types';
import { Link } from 'react-router-dom';

type CategoryItemProps = {
  category: Category;
};

export const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <div
      key={category.id}
      className='border dark:border-gray-900 pb-4 bg-white dark:bg-slate-900 rounded-md px-4 py-2'
    >
      <div className='flex justify-between items-center'>
        <div>
          <h4 className='font-semibold text-lg'>{capitalize(category.name)}</h4>
          <p className='text-sm text-gray-700 dark:text-gray-300'>
            {category.description.slice(0, 100)}...
          </p>
        </div>
        {category.image && (
          <div>
            <img
              src={category.image}
              className='w-10 h-10 object-cover rounded-md border-2 border-gray-200 dark:border-gray-800'
            />
          </div>
        )}
      </div>
      <div className='space-x-4 text-sm text-blue-500 font-medium mt-2'>
        <Link
          to={`/categories/${category.id}`}
          className='hover:text-blue-600 duration-75'
        >
          View
        </Link>
        <Link
          to={`/categories/${category.id}/edit`}
          className='hover:text-blue-600 duration-75'
        >
          Edit
        </Link>
      </div>
    </div>
  );
};
