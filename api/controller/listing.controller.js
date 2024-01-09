import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing =async (req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
        
    } catch (error) {
        next(error);
        
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };

  export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };
  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  };
  export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      
  
      
  
       
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }

      let clubhouse = req.query.clubhouse;
      if(clubhouse === undefined || clubhouse === 'false'){
        clubhouse = {$in: [false,true]};
      }

      let gym = req.query.gym;
      if(gym === undefined || gym === 'false'){
        gym = {$in: [false, true]};
      }
       let park = req.query.park;
       if(park === undefined || park === 'false'){
        park = {$in:[false, true]};

       }
      let bhktype = req.query.bhktype;
      if(bhktype === undefined || bhktype === 'all'){
        bhktype = {$in: ['studio','1bhk','2bhk','3bhk','4bhk']}
      }
      if(bhktype === '1bhk'){
        bhktype = {$in: ['1bhk']}
      }
      if(bhktype === '2bhk'){
        bhktype = {$in: ['2bhk']}
      }
      if(bhktype === '3bhk'){
        bhktype = {$in: ['3bhk']}
      }
      if(bhktype === '4bhk'){
        bhktype = {$in: ['4bhk']}
      }

      let type= req.query.type;
      if(type === undefined){
        type = {$in: ['rent','sell','lease']}
      }
      if(type === 'rent'){
        type = {$in: ['rent']}
      }
      if(type === 'sell'){
        type = {$in: ['sell']}
      }
      if(type === 'lease'){
        type = {$in: ['lease']}
      }

     



     const address = req.query.address || '';
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        address: {$regex: address, $options: 'i'},
         
        bhktype,
        type,
        parking,
        clubhouse,
        gym,
        park,

         
       
         
        
       
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  