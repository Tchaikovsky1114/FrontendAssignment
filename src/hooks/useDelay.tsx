import React, { useEffect, useRef } from 'react'

export default function useDelay() {
  const timeRef = useRef<NodeJS.Timeout | null>(null);


  const delay = (callback: () => void, time: number) => {
    if(timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      callback();
    },time)
  }

  useEffect(() => {
    return () => {
      if(timeRef.current) clearTimeout(timeRef.current)
    }
  },[])

  return {
    delay
  }
}
