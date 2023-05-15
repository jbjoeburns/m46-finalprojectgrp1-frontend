import logo from './images/piston_logo_black.png';
import './Header.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.menu');
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      if (!menu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://www.cheapshark.com/api/1.0/games?title=${searchQuery}&limit=10&exact=0`
      );
      const data = await response.json();
      setSearchResults(data);
      setIsDropdownOpen(true);
    } catch (error) {
      console.log('Error fetching games:', error);
    }
  };

  const handleResultClick = (gameID) => {
    // Handle the click event for a specific result item
    console.log(`Clicked gameID: ${gameID}`);
    setIsDropdownOpen(false); // Close the dropdown after clicking
  };

  return (
    <header className='header-container'>
      <section className='logo-section'>
        <p className='title'>Piston</p>
        <img src={logo} alt="logo" className='logo' />
      </section>
      <div className='search-bar'>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search here.."
            name="search"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button className='search-button' type="submit">Search</button>
        </form>
        {isDropdownOpen && (
          <div className='search-dropdown'>
            {searchResults.map((game) => (
              <div key={game.gameID} onClick={() => handleResultClick(game.gameID)}>
                {game.external}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
      </div>
      <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/userlist">User List</Link></li>
          <li><Link to="/login-register">Login & Register</Link></li>
        </ul>
      </div>
    </header>
  );
}