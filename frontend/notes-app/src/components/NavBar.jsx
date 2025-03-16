import React, { useState } from 'react';
import ProfileInfo from './cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './searchbar/SearchBar';

const NavBar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  return (
    <div className="bg-base-300 flex flex-col md:flex-row items-center px-4 py-2 drop-shadow gap-3">
      {/* Logo (Left) */}
      <div className="md:w-1/4 flex justify-start">
        <h2 className="text-lg font-medium">NoteS</h2>
      </div>

      {/* Search Bar (Centered) */}
      <div className="flex-grow flex justify-center w-full md:w-auto">
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      </div>

      {/* Profile (Right) */}
      <div className="md:w-1/4 flex justify-end">
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default NavBar;
