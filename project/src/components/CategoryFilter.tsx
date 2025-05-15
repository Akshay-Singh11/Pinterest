import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  const { theme } = useTheme();
  return (
    <div className="overflow-x-auto py-4 px-4 sm:px-6 md:px-8">
      <div className="flex space-x-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? theme === 'dark'
                  ? 'bg-pinterest-red text-white'
                  : 'bg-black text-white'
                : theme === 'dark'
                  ? 'bg-dark-card text-dark-text hover:bg-dark-border'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;