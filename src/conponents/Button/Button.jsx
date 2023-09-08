import React from 'react'
import styles from "./Button.module.css"

const Button = ({theme,currencyRate,baseCountry, currCountry,type, base, setBase,finalResult, setFinalResult,setScreen, screen,letter , dark, reset, equal, image}) => {
  var operations=["+","-","%","x","÷"]

  const priority = {
    "+":1,
    "-":1,
    "x":2,
    "%":2,
    "÷":2,
  }

  const write=()=>{
    if(type === "calc"){
      if(screen==="0"){
        setScreen(letter)
      }else{
        setScreen((val)=>val.length <= 30 ? val+letter : val) 
      }
      if(!operations.includes(letter)){
        calc(screen+letter)
      }
    }else{
      if(base==="0"){
        setBase(letter)
      }else{
        setBase((val)=>(val+letter).length < 15 ? val+letter : val) 
        if((base+letter).length < 15){
          currencyRate(+(base+letter),baseCountry.currency,currCountry.currency)
        }else{
          currencyRate(+base,baseCountry.currency,currCountry.currency)
        }
      }
    }
  }

  const del = ()=>{
    if(type==="calc"){
      const s = screen.slice(0,screen.length-1)
      if(screen.length >= 2 && !operations.includes(screen[screen.length-2])){
        calc(s)
      }
      if(s.length === 0){
        calc("0")
      }
      setScreen(s)
    }else{
      const s = base.slice(0,base.length-1)
      setBase(s)
      currencyRate(s,baseCountry.currency,currCountry.currency)
    }
  }

  const calc=(s)=>{
    var prefix=[]
    var ops=[]
    var number=""
    s.split("").map((l,i)=>{
      if(!operations.includes(l)){
        number+=l
      }else{
        if(l === "-" && i === 0){
          number+=l
        }
        else{
          prefix.push(number)
          number=""
          if(ops.length > 0){
            if(priority[ops[ops.length-1]] >= priority[l]){
              var c=0
              for(let x=ops.length-1;x>=0;x--){
                if(priority[ops[x]] < priority[l]){
                  c = x+1
                  break;
                }
                prefix.push(ops[x])
              }
              ops = ops.slice(0,c)
            }
          }
          ops.push(l)
        }
      }
    })
    prefix.push(number)
    ops.reverse().map((o)=>prefix.push(o))
    var result=0
    for(let i=0;i<prefix.length;i++){
      var p = prefix[i]
      if(operations.includes(p)){
        const n1= parseFloat(prefix[i-2])
        const n2= parseFloat(prefix[i-1])
        if(p === "-"){
          result = n1 - n2
        } else if(p === "+"){
          result = n1 + n2
        } else if(p === "x"){
          result = n1 * n2
        } else{
          result = n1 / n2
        }
        prefix.splice(i,1,result.toString())
        prefix.splice(i-1,1)
        prefix.splice(i-2,1)
        i-=3
      }
    }
    var final=parseFloat(prefix[0])
    if(final){
      setFinalResult(parseFloat(prefix[0]).toLocaleString())
    }else{
      setFinalResult("0")
    }
  }

  const res=()=>{
    if(type === "calc"){
      setScreen("")
      setFinalResult(0)
    }else{
      setBase("")
      currencyRate(0,baseCountry.currency,currCountry.currency)
    }
  }

  const eq=()=>{
    setScreen(finalResult.toString())
    setFinalResult("0")
  }

  return (
    <button onClick={equal ? eq : image ?  del : reset ? res : write } className={`${styles.button} ${dark && styles.dark} ${equal && styles.equal} ${theme === "dark" && styles.dark_theme}`}>
      {letter}
      {
        image && <img alt="delete" src={image} />
      }
    </button>
  )
}

export default Button
