import { FC, InputHTMLAttributes } from 'react';

type SearchBarProps = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const SearchBar: FC<SearchBarProps> = ({ className = '', ...props }) => {
  return (
    <input
      type="text"
      placeholder="Search by job title or keyword..."
      className={`rounded-full border border-gray-300 shadow-md px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#087684] focus:border-[#087684] w-full transition-colors duration-200 ${className}`}
      tabIndex={0}
      aria-label="Search by job title or keyword"
      {...props}
    />
  );
};

export default SearchBar; 