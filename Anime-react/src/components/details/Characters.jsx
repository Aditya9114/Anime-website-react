import axios from "axios";
import { useEffect, useState } from "react";
import './characters.css';

export function Characters({id}){
    const[characters, setCharacters] = useState([]);
    useEffect(()=>{
        if(id===null)return
        axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`)
        .then((res)=>{
            setCharacters(res.data.data);
        })
    },[id])
    useEffect(()=>{
        console.log(characters);
    },[characters])

    return(
        <>
            <h1>Characters </h1>
            {}
        </>
    )
}