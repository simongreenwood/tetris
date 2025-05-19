import { useEffect } from "react"

export default function Cell({color}:{color:string}) {

  return (
    <div className={`h-8 w-8 border ${color}`}></div>
  )
}