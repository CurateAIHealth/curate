"use client"
import { useEffect, useRef, useState } from "react"

const TestData=()=>{
const [Intiallvalue,setIntalValue]=useState("Sidduu")
    const ref=useRef(Intiallvalue)

  useEffect(() => {


    ref.current = Intiallvalue;
  }, [Intiallvalue]);
    return(
        <div>
          
            <p>{ref.current}</p>
            <p>{Intiallvalue}</p>

<input className="border" onChange={(e)=>setIntalValue(e.target.value)}/>
        </div>
    )
}


export default TestData