import React, {useRef, useState } from 'react'
import Button from '../Button/Button'
import styles from "./Calculator.module.css"
import deleteImg from "../../images/delete.png"
import searchImg from "../../images/search.png"
import flagImg from "../../images/flag.png"
import arrowImg from "../../images/next.png"
import {data} from "../../data.js"
import axios from "axios"

const Calculator = () => {
  data.sort((d1,d2)=>(d1.name>d2.name) ? 1 : ((d1.name<d2.name) ? -1 : 0))
  const countriesRef = useRef()
  const [info, setInfo]= useState(data)
  const [baseCountry, setBaseCountry] = useState({
    "name": "Bangladesh",
    "currency": "BDT",
    "iso2": "BD",
    "iso3": "BGD"
  })
  const [currCountry, setCurrCountry] = useState({
    "name": "Belgium",
    "currency": "EUR",
    "iso2": "BE",
    "iso3": "BEL"
  })
  const [theme, setTheme] = useState("light")
  const [toggle, setToggle] = useState(true)
  const [search, setSearch] = useState(false)
  const [toggleCountry, setToggleCountry] = useState(true)
  const [base, setBase] = useState("")
  const [searchImage, setSearchImage] = useState(searchImg)
  const [screen, setScreen] = useState("")
  const [rate, setRate] = useState(0)
  const [finalResult, setFinalResult] = useState("0")

  const calcData=[
    {
      letter:"C",
      reset:true,
      dark:true
    },{
      letter:"%",
      dark:true
    },{
      dark:true,
      image:deleteImg
    },{
      letter:"÷",
      dark:true
    },{
      letter:"7"
    },{
      letter:"8"
    },{
      letter:"9"
    },{
      letter:"x",
      dark:true
    },{
      letter:"4"
    },{
      letter:"5"
    },{
      letter:"6"
    },{
      letter:"-",
      dark:true
    },{
      letter:"1"
    },{
      letter:"2"
    },{
      letter:"3"
    },{
      letter:"+",
      dark:true
    },{
      letter:"00"
    } ,{
      letter:"0"
    } ,{
      letter:"."
    } ,{
      letter:"=",
      equal:true
    } 
  ]

  const currData=[
    {
      letter:"7",
    },{
      letter:"8",
    },{
      letter:"9",
    },{
      image:deleteImg,
      dark:true
    },{
      letter:"4",
    },{
      letter:"5",
    },{
      letter:"6",
    },{
      letter:"C",
      dark:true,
      reset:true
    },{
      letter:"1",
    },{
      letter:"2",
    },{
      letter:"3",
    },{
      letter:"00",
    },{
      letter:"0",
    },{
      letter:".",
    }
  ] 

  const handleSearch = (e) => {
    const val = e.target.value
    if(val.length > 0){
      if(val[val.length-1].toUpperCase().charCodeAt() >= 65 && val[val.length-1].toUpperCase().charCodeAt() <= 90){
        setInfo(data.filter((d)=>d.name.toLowerCase().startsWith(e.target.value.toLowerCase())))
      }
    }else{
      setInfo(data)
      countriesRef.current.scrollTop=0
    }
  }

  const handleBaseSearch=()=>{
    setSearch(true)
    setToggleCountry(true)
    setInfo(data)
  }

  const handleCurrSearch=()=>{
    setSearch(true)
    setToggleCountry(false)
    setInfo(data)
  }

  const handleBaseChosen = (d)=>{
    setBaseCountry(d)
    setSearch(false)
    currencyRate(+base, d.currency, currCountry.currency)
  }

  const handleCurrChosen = (d)=>{
    setCurrCountry(d)
    setSearch(false)
    currencyRate(+base, baseCountry.currency, d.currency)
  }

  const currencyRate=(num,baseCurrency, symbolCurrency)=>{
    axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=e3d2c51e13af4b10bf55ea61d38ccd28`)
    .then((res)=>{
      const r= (+num * (res.data.rates[symbolCurrency] / res.data.rates[baseCurrency])).toLocaleString()
      setRate(r)
    })
  }

  const handleThemeToggle=()=>{
    if(theme === "dark"){
      setTheme("light")
    }else{
      setTheme("dark")
    }
  }

  return (
    <div className={styles.calculator}>
      <div className={`${styles.calculator_contain} ${theme === "dark" && styles.calculator_contain_dark} ${search && styles.search_container}`}>
        <header>
          <div className={styles.header_head}>
            <h1 style={{color:theme === "dark" ? "#fff":"#000"}}>webGhoul Calc.</h1>
            <div className={`${styles.theme_toggle} ${theme === "light" ? styles.light : styles.dark}`}>
              <span onClick={handleThemeToggle}></span>
            </div>
          </div>
          <div className={`${styles.buttons} ${theme === "dark" && styles.buttons_dark}`}>
            <button onClick={()=>{setToggle(true);setSearch(false)}} className={`${toggle && styles.active}`}>Calculator</button>
            <button onClick={()=>setToggle(false)} className={`${!toggle && styles.active}`}>Currency Rate</button>
          </div>
        </header>
        {
          toggle?
          (
            <>
              <section className={styles.screen}>
                <textarea disabled type='text' value={screen}></textarea>
                <div className={styles.result}>{finalResult}</div>
              </section>
              <section className={styles.buttons}>
                {
                    calcData.map((d,i)=>(<Button theme={theme} type={"calc"} finalResult={finalResult} setFinalResult={setFinalResult} key={i} screen={screen} setScreen={setScreen} letter={d.hasOwnProperty("letter") && d.letter} dark={d.hasOwnProperty("dark") && d.dark} image={d.hasOwnProperty("image") && d.image} reset={d.hasOwnProperty("reset") && d.reset} equal={d.hasOwnProperty("equal") && d.equal}/>))
                }
              </section>
            </>
          ):(
            search ?(
              <>
                <section className={styles.search}>
                  <img alt="search" src={searchImage} />
                  <input onChange={handleSearch} onBlur={()=>setSearchImage(searchImg)} onFocus={()=>setSearchImage(flagImg)} type="text" placeholder='search...'/>
                </section>
                <section ref={countriesRef} className={styles.countries}>
                  {
                    info.map((d,i)=>{
                      return(
                        <article key={i} onClick={toggleCountry ? ()=>handleBaseChosen(d) : ()=>handleCurrChosen(d)} className={`${theme === "dark" && styles.article_dark}`}>
                          <img alt={d.iso2} src={`https://flagsapi.com/${d.iso2}/shiny/64.png`}/>
                          <span>{d.name}</span>
                        </article>
                      )
                    })
                  }
                </section>
              </>
            )
            :
            (
              <>
                <section className={styles.currency_screen}>
                  <article>
                    <button onClick={handleBaseSearch} className={styles.info}>
                      <img alt={baseCountry.currency} src={`https://flagsapi.com/${baseCountry.iso2}/shiny/64.png`} className={styles.country_img}/>
                      <span className={styles.curr}>{baseCountry.name}</span>
                      <img alt={"arrow"} src={arrowImg} className={styles.arrow}/>
                    </button>
                    <div className={styles.rate}>
                      <input type="text" disabled value={base}/>
                      <label>{baseCountry.currency}</label>
                    </div>
                  </article>
                  
                  <article>
                    <button onClick={handleCurrSearch} className={styles.info}>
                      <img alt={baseCountry.currency} src={`https://flagsapi.com/${currCountry.iso2}/shiny/64.png`} className={styles.country_img}/>
                      <span className={styles.curr}>{currCountry.name}</span>
                      <img alt={"arrow"} src={arrowImg} className={styles.arrow}/>
                    </button>
                    <div className={styles.rate}>
                      <span className={styles.currency_rate}>{rate}</span>
                      <span>{currCountry.currency}</span>
                    </div>
                  </article>
                </section>
                <section className={styles.buttons}>
                  {
                    currData.map((d,i)=>(<Button theme={theme} currencyRate={currencyRate} baseCountry={baseCountry} currCountry={currCountry} type="curr" key={i} base={base} setBase={setBase} letter={d.hasOwnProperty("letter") && d.letter} dark={d.hasOwnProperty("dark") && d.dark} image={d.hasOwnProperty("image") && d.image} reset={d.hasOwnProperty("reset") && d.reset}/>))
                  }
                </section>
              </>
            )
          )
        }
      </div>
    </div>
  )
}

export default Calculator