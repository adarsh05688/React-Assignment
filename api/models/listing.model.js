import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
     address: {
      type: String,
      required: true,
    },
    ptype:{
      type:String,
      required : true,
    },
    facingtype:{
      type:String,
      required : true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: false,
    },
    bhktype:{
      type:String,
      required:true,
    },
    type: {
      type: String,
      required: true,
    },
    furnished: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    balcony:{
      type:Number,
      required: true
    },
   
    maintenance:{
      type: Number,
      required: true,
    },
    availableFrom:{
      type : String,
      required : true,
    },
   
    area:{
    type: Number,
      required : true,
    },
    tenenttype:{
      type:String,
      required: true,
    },
   parking: {
      type: Boolean,
      required: true,
    },
    gym: {
      type: Boolean,
      required: true,
    },
    lift: {
      type: Boolean,
      required: true,
    },
    park: {
      type: Boolean,
      required: true,
    },
    clubhouse: {
      type: Boolean,
      required: true,
    },
    powerbackup: {
      type: Boolean,
      required: true,
    },
    gaspipeline: {
      type: Boolean,
      required: true,
    },
    firebackup: {
      type: Boolean,
      required: true,
    },
    
   
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;