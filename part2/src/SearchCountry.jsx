import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowButton = ({ onclick, country }) => {
    return (
        <button onClick = {() => onclick(country)}>Show</button>
    )
}

const DisplayWeather = ({ weather }) => {
    //console.log(weather)
    if (weather != null) {
        return (
            <div>
                <h2>Weather in {weather.name}</h2>
                <p>Temperature - {weather.main.temp} Fahrenheit</p>
                <p>Wind {weather.wind.speed} m/s</p>
            </div>
        )
    }
}

const DisplayOneCountry = ({ country }) => {
    //console.log(country)
    if (country != '') {
        const lang = Object.values(country.languages)
        const lat = country.latlng[0]
        const lng = country.latlng[1]
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital {country.capital}</p>
                <p>Area {country.area}</p>
                <h2>Languages</h2>
                <ul>
                    {lang.map((value, index) => <li key={index}>{value}</li>)}
                </ul>
                <img src={country.flags.png}></img>
            </div>
        )
    }
}

const DisplayCountries = ({ countries, onClick, weather }) => {
    if (countries.length === 0) return <p>No country to show. Please type country name to search.</p>
    if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <DisplayOneCountry country = {country} />
                <DisplayWeather weather = {weather}/>
            </div>
            
        )
    }

    if (countries.length <= 10) {
        return (
            countries.map((country, index) => {
                return (
                    <p key = {index}>
                        {country.name.common}
                        <ShowButton onclick = {onClick} country = {country}/>
                    </p>
                )
                
            })
        )
    }

    if (countries.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    }
    
}

const SearchCountry = () => {

    const [name, setName] = useState('')
    const [countries, setCountries] = useState([])
    const [filtCountries, setFiltCountries] = useState([])
    const [weather, setWeather] = useState(null)

    //console.log(api_key)

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                //console.log('promoise fulfilled')
                //console.log(response.data)
                setCountries(response.data)
                //setName(response.data)
            })

        // if (filtCountries != undefined && filtCountries.length == 1) {
        //     axios
        //         .get(`https://api.openweathermap.org/data/2.5/weather?q=${filtCountries[0].name.common}&appid=${api_key}`)
        //         .then(response => {
        //             console.log("promoise fulfilled")
        //             setWeather(response.data)
        //         })
        // }
    }, [])

    useEffect(() => {
        console.log(name);
        if (!name || name === '') {
            setFiltCountries([])
            return;
        }
        console.log("reached")
        const res = countries.filter(country => isSimilar(country))

        setFiltCountries(res)

    }, [name])

    useEffect(() => {
        console.log('assign weather triggered')
        if (filtCountries.length == 0) return setWeather(null);

        if (filtCountries.length == 1 && weather === null) {
            
            console.log("assign weather")
            axios
                .get(`https://api.openweathermap.org/data/2.5/weather`,
                    {
                        params: {
                        q: filtCountries[0].name.common,
                        appid: import.meta.env.VITE_SOME_KEY,
                        units: "metric",
                        },
                    })
                .then(response => {
                    console.log(response.data)
                    setWeather(response.data)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [filtCountries])

    const isSimilar = (country) => {
        if (country == undefined) return false
        const compare = country.name.common.toLowerCase()
        return compare.indexOf(name.toLowerCase()) != -1
    }

    const handleCountryNameSearch = (event) => {
        event.preventDefault()
        //console.log("event happened")
        //console.log(countries)
        //console.log(name)
        //console.log(getFilteredCountries())
        setName(event.target.value)
        //setSearchName(event.target.value)
        //setFiltCountries(getFilteredCountries())
    }

    const handleShow = (country) => {
        setFiltCountries([country])
    }

    return (
        <div>
            find countries <input 
                value = {name}
                onChange = {handleCountryNameSearch}
            />
            <DisplayCountries 
                countries = {filtCountries} 
                onClick = {handleShow}
                weather = {weather}
            />
        </div>
    )
}

export default SearchCountry