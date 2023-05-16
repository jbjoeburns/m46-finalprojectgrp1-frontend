import './underx.css';
import Underx from './underx.js';
import Wishlist from './wishlist.js';
import { useEffect, useState } from 'react';
import * as React from 'react';
import {getWishList} from "../../utils";

const Underxcontainer = () => {
  const [wishListArray, setWishListArray] = useState("eg");
  const [updateStateArray, setUpdateStateArray] = useState([1])
  useEffect(() => {
  const fetchData = async () => {
    let gamesOnWishListobj = await getWishList()
    let gamesOnWishList = JSON.stringify(gamesOnWishListobj).replaceAll(",", "%2C").replace(/[^a-zA-Z0-9%]/g, "");
    setWishListArray(gamesOnWishList)
  };
  fetchData();
  }, [updateStateArray])
  console.log({wishListArray})
  return (
    <div className='underxcontainer'>
      <p id='testText'></p>
      {wishListArray ?
      <>
        <Underx id="under7" setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} APIurl = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&steamRating=85&upperPrice=7&lowerPrice=4&pageSize=22&pageNumber=' titleText = 'Games under £7'/>
        <Underx id="under4" setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} APIurl = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&steamRating=85&upperPrice=3.99&lowerPrice=0.01&pageSize=22&pageNumber=' titleText = 'Games under £4'/>
        {/* <Underx id="free" setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} APIurl = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=0&pageSize=10&pageNumber=' titleText = 'Free games'/> */}
        {/* <Wishlist setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} titleText = 'Wishlist'/> */}
      </>
      :
      <>
        <Underx id="under7" setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} APIurl = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&steamRating=85&upperPrice=7&lowerPrice=4&pageSize=22&pageNumber=' titleText = 'Games under £7'/>
        <Underx id="under4" setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} APIurl = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&steamRating=85&upperPrice=3.99&lowerPrice=0.01&pageSize=22&pageNumber=' titleText = 'Games under £4'/>
        {/* <Underx id="free" setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} APIurl = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=0&pageSize=10&pageNumber=' titleText = 'Free games'/> */}
        <Wishlist setWishListArray = {setWishListArray} wishListArray = {wishListArray} setUpdateStateArray = {setUpdateStateArray} updateStateArray = {updateStateArray} titleText = 'Wishlist'/>
      </>
      }
    </div>
  );
};

export default Underxcontainer;