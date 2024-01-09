import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'rent',
    bhktype :'all',
    parking: false,
    gym:false ,
    clubhouse:false,
    park :false,
     
    sort: 'created_at',
    order: 'desc',
  });
 

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const bhktypeFromUrl = urlParams.get('bhktype');
    const parkingFromUrl = urlParams.get('parking');
    const gymFromUrl = urlParams.get('gym');
    const clubhouseFromUrl = urlParams.get('clubhouse');
    const parkFromUrl = urlParams.get('park')
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      bhktypeFromUrl ||
      parkingFromUrl ||
      gymFromUrl ||
      clubhouseFromUrl ||
      parkFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'rent',
        bhktype : bhktypeFromUrl || '2bhk',
        parking: parkingFromUrl === 'true' ? true : false,
        gym: gymFromUrl === 'true' ? true : false,
        clubhouse: clubhouseFromUrl === 'true' ? true : false,
        park : parkFromUrl === 'true' ? true :false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'lease' ||
      e.target.id === 'rent' ||
      e.target.id === 'sell'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (
      e.target.id === 'all' ||
      e.target.id === '1bhk' ||
      e.target.id === '2bhk'|| e.target.id === '3bhk'|| e.target.id ==='4bhk'
    ) {
      setSidebardata({ ...sidebardata, bhktype: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'gym' ||
      e.target.id === 'clubhouse'|| e.target.id === 'park'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('bhktype', sidebardata.bhktype);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('gym', sidebardata.gym);
    urlParams.set('clubhouse', sidebardata.clubhouse);
    urlParams.set('park', sidebardata.park);
    urlParams.set('sort',sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Society:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sell'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sell'}
              />
              <span>Buy</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='lease'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'lease'}
              />
              <span>Lease</span>
            </div>
            
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>BHK Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bhktype === 'all'}
              />
              <span>All</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='1bhk'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bhktype === '1bhk'}
              />
              <span>1 BHK</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='2bhk'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bhktype === '2bhk'}
              />
              <span>2 BHK</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='3bhk'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bhktype === '3bhk'}
              />
              <span>3 BHK</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='4bhk'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.bhktype === '4bhk'}
              />
              <span>4 BHK</span>
            </div>
            
          </div>
           
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='gym'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.gym}
              />
              <span>Gym</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='clubhouse'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.clubhouse}
              />
              <span>Club House</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='park'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.park}
              />
              <span>Park</span>
            </div>
             
            
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}




