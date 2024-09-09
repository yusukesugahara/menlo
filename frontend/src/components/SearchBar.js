import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className='searchbar'>
      <input
        type="text"
        placeholder="検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">検索</button>
    </form>
  );
};

export default SearchBar;
