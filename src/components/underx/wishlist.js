import "./underx.css"
import { useEffect, useState } from "react"
import * as React from "react"
import { removeWishList } from "../../utils"
import "../../global.css"

const Wishlist = (props) => {
  const [allCharacters, setAllCharacters] = useState([])
  const [gameLookUp, setGameLookUp] = useState(null)
  const [dealLookUp, setDealLookUp] = useState(null)
  const [gameID, setGameID] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [saleVal, setSaleVal] = useState(null)
  const [origVal, setOrigVal] = useState(null)
  const [discount, setDiscount] = useState(null)
  const [steamAppID, setSteamAppID] = useState(null)
  const [saleGameTitle, setSaleTitle] = useState(null)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URLbase = "https://www.cheapshark.com/api/1.0/deals?storeID=1&steamAppID="
        let APIurlWishList = URLbase.concat(props.wishListArray)
        let response = await fetch(APIurlWishList)

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const data = await response.json()
        setAllCharacters(data)
      } catch (err) {
        console.log(err)
        setErrorMsg(err)
      }
    }
    fetchData()
  }, [props])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let URL = "https://www.cheapshark.com/api/1.0/games?id=".concat(gameID)
        let response = await fetch(URL)

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const data = await response.json()
        let dealData = data.deals
        setDealLookUp(dealData)
        setGameLookUp(data)
      } catch (err) {
        console.log(err)
        setErrorMsg(err)
      }
    }
    fetchData()
  }, [gameID])

  function handleClick(game) {
    let gameSaleID = game.gameID

    setGameID(gameSaleID)

    let gameSaleprice = game.salePrice
    let gameOrigPrice = game.normalPrice
    let gameDiscount = Math.round(game.savings)
    let gameTitle = game.title
    let steamAppID = game.steamAppID

    setSaleVal(gameSaleprice)
    setOrigVal(gameOrigPrice)
    setDiscount(gameDiscount)
    setSaleTitle(gameTitle)
    setSteamAppID(steamAppID)
    setOpen(!open)
  }

  function handleClose() {
    setOpen(!open)
  }

  function HandleWishlist(steamAppID) {
    let wishListSteamIDsArray = props.wishListArray
    let indexID = wishListSteamIDsArray.indexOf(steamAppID)

    if (indexID === 0) {
      let steamAppIDCut = steamAppID.concat("%2C")
      wishListSteamIDsArray.replace(steamAppIDCut, 1)
    }
    else {
      let steamAppIDCut = "%2C".concat(steamAppID)
      wishListSteamIDsArray.replace(steamAppIDCut, 1)
    }

    const updateBackend = async () => {
      const statusCode = await removeWishList(steamAppID)

      if (statusCode === 204) {
        props.setWishListArray(wishListSteamIDsArray)
        props.setUpdateStateArray([...props.updateStateArray, 2])
        setOpen(!open)
      }
    }

    updateBackend()
    setOpen(!open)
  }


  return (
    <div className="containerbox">
      <br></br>
      <h1 className="headerStyle">{props.titleText}
      </h1>
      {errorMsg && <h3>{errorMsg}</h3>}
      {open ?
        <div></div> :
        <div className="popUpBox">
          <div className="xStyle" onClick={() => handleClose()}>❌</div>
          <div className="saleText">Game: {saleGameTitle}</div>
          <div className="saleText">Price: ${saleVal} <del>${origVal}</del></div>
          <h1>Cheapest ever price: ${gameLookUp.cheapestPriceEver.price}</h1>
          <div className="saleText">{discount}% OFF!!</div>
          <br></br>
          <b className="headerStyle wishlistMO" onClick={() => HandleWishlist(steamAppID)}>Remove from wishlist</b>
          <br></br>
          <br></br>
          <h1>Stores (cheapest to most expensive)</h1>
          <div className="diffStoreArray">
            {dealLookUp.map((store, index) => {
              let storeIDForURL = store.storeID - 1
              let storeURL = "https://www.cheapshark.com/img/stores/banners/".concat(storeIDForURL).concat(".png")
              if (store.price =! store.retailPrice) {
                return (
                  <div className="buttonStyling" key={index}>
                    <img href={index} key={index} src={storeURL} alt={index}></img>
                    <p>Current Price: ${store.price}</p>
                    <p>Retail Price: ${store.retailPrice}</p>
                  </div>
                )
              }
            })}
          </div>
        </div>}
      <div className="buttonContainer">
        {allCharacters.length === 0 &&
          <div className="headerStyle">No sales...</div>
        }
        {allCharacters.map((game, index) => {
          return (
            <div key={index}>
              <button className="buttonStyling buttonStyleRemove" onClick={() => handleClick(game)}>
                <img href={index} src={game.thumb} alt={index}></img>
                <p><del>${game.normalPrice}</del></p>
                <p>${game.salePrice}</p>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Wishlist