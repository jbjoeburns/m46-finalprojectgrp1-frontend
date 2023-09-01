import { useEffect, useState } from "react"
import * as React from "react"
import { useLocation } from "react-router-dom"
import { addWishList } from "../../utils"
import "./searchresults.css"

const SearchPage = () => {
  const [pageNum, setpageNum] = useState(0)
  const [steamData, setSteamData] = useState(null)
  const [allCharacters, setAllCharacters] = useState([])
  const [gameLookUp, setGameLookUp] = useState(null)
  const [dealLookUp, setDealLookUp] = useState(null)
  const [gameID, setGameID] = useState(1)
  const [errorMsg, setErrorMsg] = useState(null)
  const [steamAppID, setSteamAppID] = useState(null)
  const [saleVal, setSaleVal] = useState(null)
  const [origVal, setOrigVal] = useState(null)
  const [discount, setDiscount] = useState(null)
  const [saleGameTitle, setSaleTitle] = useState(null)
  const [open, setOpen] = useState(true)

  let location = useLocation()

  useEffect(() => {
    let locationPathname = location.pathname.replaceAll("/search/", "")
    const fetchData = async () => {
      try {
        let pageURL = "https://www.cheapshark.com/api/1.0/games?title=".concat(locationPathname)
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
  }, [location, pageNum])

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
    let gameTitle = game.external

    const fetchData = async () => {
      try {
        let URL = "https://www.cheapshark.com/api/1.0/deals?exact=1&title=".concat(gameTitle)
        let response = await fetch(URL)

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const data = await response.json()
        
        setSteamData(data)
      } catch (err) {
        console.log(err)
        setErrorMsg(err)
      }

      let gameSaleID = steamData[0].gameID
      setGameID(gameSaleID)
      let gameSaleprice = steamData[0].salePrice
      let gameOrigPrice = steamData[0].normalPrice
      let gameDiscount = Math.round(steamData[0].savings)
      let steamAppID = steamData[0].steamAppID
      setSaleVal(gameSaleprice)
      setOrigVal(gameOrigPrice)
      setDiscount(gameDiscount)
      setSaleTitle(gameTitle)
      setSteamAppID(steamAppID)
      setOpen(!open)
    }
    fetchData()
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
    const updateBackend = async () => {
      const response = await addWishList(steamAppID)
      if (response.message === "success") {
        setOpen(!open)
      }
    }
    updateBackend()
  }


  return (
    <div className="containerbox">
      <br></br>
      <h1 id="headerStyle">Search Results
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

        </div>}
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
              </button>
            </div>
          )
        })}
        <button id="buttonStyling" className="buttonStyleRemove3" onClick={() => handleNext()}><b>&#9654;</b></button>
      </div>
    </div>
  )
}

export default SearchPage