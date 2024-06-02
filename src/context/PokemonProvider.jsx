import { useEffect, useState } from "react";
import { PokemonContext } from "./PokemonContext";
import { Result } from "postcss";
import { useForm } from "../hook/useForm";

export const PokemonProvider = ({ children }) => {

    const[allPokemons, setAllPokemons] = useState([])
    const [globalPokemons, setGlobalPokemons] = useState([])
    const [offset, setOffset] = useState(0)

    // utilizar CustomHook - useForm
    const {valueSearch, onInputChange, onrResetForm} = useForm({
        valueSearch: '',
    })

    //estados para la aplicacion simple
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState(false)

    // llamamos 50 pokemons API
    const getAllPokemons = async(limit = 50) => {
        const baseURL = 'https://pokeapi.co/api/v2/'

        const res = await fetch(
            `${baseURL}pokemon?limit=${limit}&iffset=${offset}`
        );
        const data = await res.json();
        
        const promises = data.results.map(async(pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json()
            return data
        })
        const results = await Promise.all(promises)

        setAllPokemons([...allPokemons, ...results]);
        setLoading(false)
    }

    // llamamos a todos los pokemons
    const getGlobalPokemons = async() => {
        const baseURL = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${baseURL}pokemon?limit=10000&offset=0`)
        const data = await res.json();
        
        const promises = data.results.map(async(pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json()
            return data
        })
        const results = await Promise.all(promises)

        setGlobalPokemons(results);
        setLoading(false)
    }

    //llamar a un poco por id
    const getPokemonByID = async(id) => {
        const  baseURL = 'https://pokeapi.co/api/v2/'

        const res = await fetch(`${baseURL}pokemon/${id}`)
        const data = await res.json()
        return data
    }


    useEffect(() => {
        getAllPokemons()
    },[])


    return (
        <PokemonContext.Provider 
            value={{
                valueSearch,
                onInputChange,
                onrResetForm,
                allPokemons,
                globalPokemons,
                getPokemonByID
            }}
        >
            {children}
        </PokemonContext.Provider>
    )
}
