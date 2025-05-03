import { useState, useEffect } from 'react'
import axios from 'axios'

const key = import.meta.env.VITE_weather_key

const getCityWeather = (city) => {
  console.log(`getting weather for ${city}`)
  return axios.get(`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`)
    .then(response => response.data)
}

const Weather = ({ weather }) => {
  if (!weather) {
    return null
  }

  return (
    <>
      <p>Temperature (C): {weather.current.temp_c}</p>
      <p>Wind (kph): {weather.current.wind_kph}</p>
      <p>Condition: {weather.current.condition.text}</p>
      <img src={weather.current.condition.icon}></img>
    </>
  )
}

const getCountryData = (country) => {
  console.log(country)
  return axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
    .then(response => response.data)
}

const CountryInfo = ({ countryData, weather }) => {
  if (!countryData) {
    return null
  }

  return (
    <>
      <h1>{countryData.name.common}</h1>
      <p>Capital: {countryData.capital[0]}</p>
      <p>Population: {countryData.population}</p>
      <p>Continent: {countryData.continents[0]}</p>
      <img src={countryData.flags.png}></img>
      <Weather weather={weather} />
    </>
  )
}

const CountryList = ({ countriesToShow, selectCountry }) => {
  if (countriesToShow.length > 10) {
    return <p>Too many results</p>
  } else if (countriesToShow.length > 1) {
    return (
      <ul>
        {countriesToShow.map(c => {
          return <li key={c}>{c}
            <button onClick={() => selectCountry(c)}>Show</button>
          </li>
        })}
      </ul>
    )
  } else if (countriesToShow.length === 1) {
    return null
  } else {
    return <p>No results</p>
  }
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setFilteredCountries] = useState([])
  const [countryData, setCountryData] = useState(null)
  const [weather, setWeather] = useState()

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.data)
      .then(allCountriesData => {
        setCountries(allCountriesData.map(c => c.name.common))
      })
      .catch(error => {
        console.log('Failed to load countries')
      })
  }, [])

  const onChange = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    setFilteredCountries(countries.filter(c => c.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      console.log(countriesToShow[0])
      getCountryData(countriesToShow[0])
        .then(newCountryData => setCountryData(newCountryData))
    } else {
      setCountryData(null)
    }
  }, [countriesToShow])

  useEffect(() => {
    if (countryData) {
      getCityWeather(countryData.capital[0])
        .then(newWeather => {
          setWeather(newWeather)
        })
    } else {
      setWeather(null)
    }
  }, [countryData])

  const selectCountry = (country) => {
    setFilteredCountries([country])
  }

  return (
    <>
      <p>Find country: </p>
      <input onChange={onChange}></input>

      <CountryList countriesToShow={countriesToShow} selectCountry={selectCountry} />

      <CountryInfo countryData={countryData} weather={weather} />

    </>
  )
}

export default App
