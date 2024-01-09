import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    address: '',
    ptype: '',
    facingtype:'',
    regularPrice:1,
    deposit :1,
    bhktype:'',
    type:'',
    furnished:'',
    bedrooms:1,
    bathrooms:1,
    balcony:1,
    maintenance :1,
    availableFrom :'',
    area:1,
    tenenttype:'',
    parking :false,
    gym:false,
    lift:false,
    park:false,
    clubhouse:false,
    powerbackup:false,
    gaspipeline:false,
    firebackup:false,
    
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === '1bhk' || e.target.id === '2bhk' || e.target.id === '3bhk'|| e.target.id ==='studio'|| e.target.id === '4bhk') {
      setFormData({
        ...formData,
        bhktype: e.target.id,
      });
    }
    if (e.target.id === 'rent' || e.target.id === 'sell' || e.target.id === 'lease') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (e.target.id === 'unfurnished' || e.target.id === 'semifurnished' || e.target.id === 'fullyfurnished') {
      setFormData({
        ...formData,
        furnished: e.target.id,
      });
    }
    if (e.target.id === 'anyone' || e.target.id === 'bachelor' || e.target.id === 'family' || e.target.id === 'company') {
      setFormData({
        ...formData,
        tenenttype: e.target.id,
      });
    }




    if (
      e.target.id === 'parking' || e.target.id === 'clubhouse'|| e.target.id === 'powerbackup'||
      e.target.id === 'gym' || e.target.id === 'gaspipeline' || e.target.id === 'firebackup' ||
      e.target.id === 'lift'|| e.target.id === 'park'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-8'>
        <div className='flex flex-col gap-4 flex-1'>
        <label for="name" class="block text-sm font-medium text-gray-700">Property Name</label>
          <input
            type='text'
            placeholder='E.g: Prestige lakeSide habitat '
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
           <label for="address" class="block text-sm font-medium text-gray-700">Property Address</label>
          <input
            type='text'
            placeholder='e.g : whitefeild , Bangalore'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
           <label for="ptype" class="block text-sm font-medium text-gray-700">Property Type</label>
          <input
            type='text'
            placeholder='e.g apartment/villa'
            className='border p-3 rounded-lg'
            id='ptype'
            required
            onChange={handleChange}
            value={formData.ptype}
          />
           <label for="facingtype" class="block text-sm font-medium text-gray-700">Facing Type</label>
          <input
            type='text'
            placeholder='e.g east/west'
            className='border p-3 rounded-lg'
            id='facingtype'
            required
            onChange={handleChange}
            value={formData.facingtype}
          />
           <label for="regularPrice" class="block text-sm font-medium text-gray-700">Expected Amount</label>
          <input
             type='number'
             id='regularPrice'
             min='1'
             max='1000000'
             required
             className='p-3 border border-gray-300 rounded-lg'
             onChange={handleChange}
             value={formData.regularPrice}
          />
           <label for="deposit" class="block text-sm font-medium text-gray-700">Deposit</label>
          <input
            type='number'
            id='deposit'
            min='1'
            max='1000000'
            
            className='p-3 border border-gray-300 rounded-lg'
            onChange={handleChange}
            value={formData.deposit}
          />

         <label for="bhktype" class="block text-sm font-medium text-gray-700">Bhk type</label>
          <div className='flex gap-4 flex-wrap'>
          
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='studio'
                className='w-5'
                onChange={handleChange}
                checked={formData.bhktype === 'studio'}
              />
              <span>Studio</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='1bhk'
                className='w-5'
                onChange={handleChange}
                checked={formData.bhktype === '1bhk'}
              />
              <span>1 BHK</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='2bhk'
                className='w-5'
                onChange={handleChange}
                checked={formData.bhktype === '2bhk'}
              />
              <span>2 BHK</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='3bhk'
                className='w-5'
                onChange={handleChange}
                checked={formData.bhktype === '3bhk'}
              />
              <span>3 BHK</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='4bhk'
                className='w-5'
                onChange={handleChange}
                checked={formData.bhktype === '4bhk'}
              />
              <span>4 BHK</span>
            </div>
              </div>

              <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
              <div className='flex gap-8 flex-wrap'>
              <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
              </div>
              <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sell'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sell'}
              />
              <span>Sell</span>
              </div>
              <div className='flex gap-2'>
              <input
                type='checkbox'
                id='lease'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'lease'}
              />
              <span>Lease</span>
              </div>
                
              </div>
              <label for="furnished" class="block text-sm font-medium text-gray-700">Furnished Type</label>
              <div className='flex gap-3.5 flex-wrap'>
              <div className='flex gap-2'>
              <input
                type='checkbox'
                id='unfurnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished === 'unfurnished'}
              />
              <span>Un-Furnished</span>
              </div>
              <div className='flex gap-2'>
              <input
                type='checkbox'
                id='semifurnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished === 'semifurnished'}
              />
              <span>Semi-Furnished</span>
              </div>
              <div className='flex gap-2'>
              <input
                type='checkbox'
                id='fullyfurnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished === 'fullyfurnished'}
              />
              <span>Fully-Furnished</span>
              </div>
                
              </div>
              <label for="select" class="block text-sm font-medium text-gray-700">Select </label>

          <div className='flex flex-wrap gap-1'>
         
            <div className='flex items-center gap-2'>
           
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='balcony'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.balcony}
              />
              <p>Balcony</p>
            </div>
           
             
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
        <label for="maintenance" class="block text-sm font-medium text-gray-700">Maintenance</label>
        <div className='flex flex-col gap-4'>
              <input
                type='number'
                id='maintenance'
                min='1'
                max='1000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.maintenance}
              />
               
              </div>
        <label for="availableFrom" class="block text-sm font-medium text-gray-700">Available From</label>
        <div className='flex flex-col gap-4'>
              <input
                type='text'
                id='availableFrom'
                 placeholder='DD/MM/YYYY'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.availableFrom}
              />
               
              </div>
        <label for="area" class="block text-sm font-medium text-gray-700">Area(sqft)</label>
        <div className='flex flex-col gap-4'>
              <input
            type='number'
            id='area'
            min='1'
            max='1000000'
            required
            className='p-3 border border-gray-300 rounded-lg'
            onChange={handleChange}
            value={formData.area}
              />
               
              </div>
              <label for="bhktype" class="block text-sm font-medium text-gray-700">Tenent Preference</label>
          <div className='flex gap-4 flex-wrap'>
          
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='anyone'
                className='w-5'
                onChange={handleChange}
                checked={formData.tenenttype === 'anyone'}
              />
              <span>Anyone</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='bachelor'
                className='w-5'
                onChange={handleChange}
                checked={formData.tenenttype === 'bachelor'}
              />
              <span>Bachelor</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='family'
                className='w-5'
                onChange={handleChange}
                checked={formData.tenenttype === 'family'}
              />
              <span>Family</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='company'
                className='w-5'
                onChange={handleChange}
                checked={formData.tenenttype === 'company'}
              />
              <span>Company</span>
            </div>
             
              </div>
              <label for="amenties" class="block text-sm font-medium text-gray-700">Amenties</label>
          <div className='flex gap-3 flex-wrap'>
          
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='gym'
                className='w-5'
                onChange={handleChange}
                checked={formData.gym}
              />
              <span>Gym</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='clubhouse'
                className='w-5'
                onChange={handleChange}
                checked={formData.clubhouse}
              />
              <span>Club House</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='powerbackup'
                className='w-5'
                onChange={handleChange}
                checked={formData.powerbackup}
              />
              <span>Power Backup</span>
            </div>
             
              </div>
          <div className='flex gap-7 flex-wrap'>
          
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='lift'
                className='w-5'
                onChange={handleChange}
                checked={formData.lift}
              />
              <span>Lift</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='park'
                className='w-5'
                onChange={handleChange}
                checked={formData.park}
              />
              <span>Park</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='gaspipeline'
                className='w-5'
                onChange={handleChange}
                checked={formData.gaspipeline}
              />
              <span>Gas Pipeline</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='firebackup'
                className='w-5'
                onChange={handleChange}
                checked={formData.firebackup}
              />
              <span>Fire Backup</span>
            </div>
             
              </div>

          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
