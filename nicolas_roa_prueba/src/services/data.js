import { useEffect, useState } from 'react'

export const useFetch = () => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {

    setLoading(true)
    setError(null)

    fetch('https://data.cdc.gov/api/views/bxq8-mugm/rows.json')
      .then(res => res.json())
      .then(json => {
        setLoading(false)
        if (json) {
          setData(json)
        } else {
          setData([])
        }
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])
  return { data, loading, error }
}
