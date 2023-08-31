import "./underx.css"
import { useEffect, useState } from "react"
import * as React from "react"
import { addWishList } from "../../utils"

const Underx = (props) => {
  const [pageNum, setpageNum] = useState(0)
  const [allCharacters, setAllCharacters] = useState([])
  const [gameLookUp, setGameLookUp] = useState(null)
  const [dealLookUp, setDealLookUp] = useState(null)
  const [gameID, setGameID] = useState(143325)
  const [errorMsg, setErrorMsg] = useState(null)
  const [steamAppID, setSteamAppID] = useState(null)
  const [saleVal, setSaleVal] = useState(null)
  const [origVal, setOrigVal] = useState(null)
  const [discount, setDiscount] = useState(null)
  const [saleGameTitle, setSaleTitle] = useState(null)
  const [open, setOpen] = useState(true)
  const [varChange, setVarchange] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        let pageURL = props.APIurl.concat(pageNum)
        let response = await fetch(pageURL)

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
  }, [pageNum, props.APIurl])

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
        // console.log(response)
        // console.log(data)
        console.log(gameLookUp)
      } catch (err) {
        console.log(err)
        setErrorMsg(err)
      }
    }
    fetchData()
    
  }, [gameID, varChange])

  function handleClick(game) {
    setVarchange(!varChange)  
    let gameSaleID = game.gameID
    setGameID(gameSaleID)
    alert(gameSaleID)
    console.log(gameID)
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
    updateFunction(gameID)
    setOpen(!open)
  }

  function updateFunction(updateVal) {
    console.log(updateVal)
  }

  function handleClose() {
    setOpen(!open)
  }

  function handleNext() {
    let pageTo = Number(pageNum)
    setpageNum(pageTo + 1)
  }

  function handlePrev() {
    let pageTo = Number(pageNum)

    if (pageTo > 0) {
      let pageTo = Number(pageNum)
      setpageNum(pageTo - 1)
    }
  }

  function HandleWishlist(steamAppID) {
    let wishListSteamIDsArray = props.wishListArray

    wishListSteamIDsArray.concat(steamAppID)

    const updateBackend = async () => {
      const response = await addWishList(steamAppID)

      if (response.message === "success") {
        props.setWishListArray(wishListSteamIDsArray)
        props.setUpdateStateArray([...props.updateStateArray, 2])
        setOpen(!open)
      }
    }
    updateBackend()
  }

  return (
    <div className="containerbox">
      <br></br>
      <h1 id="headerStyle">{props.titleText}
      </h1>
      {/* {errorMsg && <h3>{errorMsg}</h3>} */}
      {open ?
        <div></div> :
        <div id="popUpBox">
          <div id="xStyle" onClick={() => handleClose()}>❌</div>
          <div id="saleText">Game: {saleGameTitle}</div>
          <div id="saleText">Price: ${saleVal} <del>${origVal}</del></div>
          <h1>Cheapest ever price: ${gameLookUp.cheapestPriceEver.price}</h1>
          <div id="saleText">{discount}% OFF!!</div>
          <br></br>
          <b id="headerStyle" className="wishlistMO" onClick={() => HandleWishlist(steamAppID)}>Add to wishlist</b>
          <br></br>
          <br></br>
          <h1>Stores (cheapest to most expensive)</h1>
          <div id="diffStoreArray">
            {dealLookUp.map((store, index) => {
              let storeIDForURL = store.storeID - 1
              let storeURL = "https://www.cheapshark.com/img/stores/banners/".concat(storeIDForURL).concat(".png")
              if (store.price === store.retailPrice) {
                return (
                  <div id="buttonStyling" key={index}>
                    <img href={index} src={storeURL} alt=""></img>
                    <p>Current Price: ${store.price}</p>
                    <p>Retail Price: ${store.retailPrice}</p>
                  </div>
                )
              }
            })}
          </div>

        </div>
        }
      <div id="buttonContainer">
        <button id="buttonStyling" className="buttonStyleRemove1" onClick={() => handlePrev()}><b>&#9664;</b></button>
        {allCharacters.length === 0 &&
          <div id="headerStyle">No sales...</div>
        }

        {allCharacters.map((game, index) => {
          return (
            <div className="games-container" key={index}>
              <button id="buttonStyling" className="buttonStyleRemove" onClick={() => handleClick(game)}>
                <img href={index} src={game.thumb} alt=""></img>
                <p><del>${game.normalPrice}</del></p>
                <p>${game.salePrice}</p>
              </button>
            </div>
          )
        })}
        <button id="buttonStyling" className="buttonStyleRemove3" onClick={() => handleNext()}><b>&#9654;</b></button>
      </div>
    </div>
  )
}

export default Underx