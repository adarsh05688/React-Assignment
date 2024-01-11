import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {BsHouseDoor} from 'react-icons/bs'
 
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [address, setaddress] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('address', address);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('address');
    if (searchTermFromUrl) {
      setaddress(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className='bg-white shadow-md overflow-hidden '>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3 sticky'>
      <Link to='/'>
        <h1 className='font-bold sm:text-lg flex flex-wrap '>
          <span className='text-blue-800 text-2xl'>Ausumn </span>
          <span className='text-blue-800 text-2xl'>Realty</span>
          <BsHouseDoor className='ml-2 mt-1 size-6'/>
        </h1>
      </Link>
      <form  onSubmit={handleSubmit}
        
        className='rounded-lg flex  ml-20'
      >
         
         <Link
          className=' items-end bg-green-700 text-white pl-5 pr-5 pt-2 pb-2 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
        
         
      </form>
      <ul className='flex gap-4 items-center'>
        <Link to='/'>
          <li className='hidden sm:inline text-blue-900 hover:underline text-xl'>
            Home
          </li>
        </Link>
        <Link to='/about'>
          <li className='hidden sm:inline text-blue-900 hover:underline text-xl'>
            About
          </li>
        </Link>
        <Link to='/search'>
          <li className='hidden sm:inline text-blue-900 hover:underline text-xl'>
            Listings
          </li>
        </Link>
        <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
      
      </ul>
    </div>
  </header>
  )
}

export default Header