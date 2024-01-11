import React, { useState } from 'react'
import classes from './hero.module.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';


function Hero() {
    const [address,setaddress] = useState("bangalore");
    const [type, settype] = useState('rent');
    const [searchTerm , setsearchTerm] = useState('prestige');
    const navigate = useNavigate();
    const handleSearch =(e)=>{
      e.preventDefault();
       
      
      navigate(`/search?address=${address}&searchTerm=${searchTerm}&type=${type}`);


    }
 
    return (

        <div className={classes.container}>
          <div className={classes.wrapper}>
            <h2>Let me find your dream place right now</h2>
            <h5>Search the best selection of luxury real estate</h5>
            <div className={classes.options} >
            
              
              
              <select onChange={(e)=> setaddress(e.target.value)} >
                <option disabled>Select City</option>
                <option value="bangalore">Bangalore</option>
                <option value="delhi">Delhi</option>
                <option value="pune">Pune</option>
              </select>
              <select onChange={(e)=>settype(e.target.value)}>
                <option disabled>Select Type</option>
                <option value="rent">Rent</option>
                <option value="sell">Buy</option>
                <option value="lease">Lease</option>
                
              </select>
              <select onChange={(e)=>setsearchTerm(e.target.value)}>
                <option disabled>Select Builder</option>
                <option value="prestige">Prestige</option>
                <option value="brigade">Bridage</option>
                <option value="sobha">Sobha</option>
                <option value="godrej">Godrej</option>
                <option value="l&t">L&T</option>
                <option value="cenduer">Cenduer</option>
              </select>
              <AiOutlineSearch className={classes.searchIcon} onClick={handleSearch}/>
          
              </div>
             
           
          </div>
        </div>
  )
}

export default Hero