import axios from "axios";
import { useEffect, useState } from "react";
import "./AvailableInfo.css";

export function AvailableInfo({ id }) {
  const [streaming, setStreaming] = useState([]);
  useEffect(() => {
    axios
      .get(`https://api.jikan.moe/v4/anime/${id}/streaming`)
      .then((res) => {
        console.log("result");
        setStreaming(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <>
      {streaming.length > 1 && (
        <div className="logoContainer">
          <p>Available On</p>

          <div className="logos">
            {streaming.map((s, index) => {
              if (s.name === "Crunchyroll") {
                return (
                  <img
                    key={index}
                    src={`${import.meta.env.BASE_URL}icons/crunchyroll.png`}
                    alt="Crunchyroll"
                  />
                );
              } else if (s.name === "Netflix") {
                return (
                  <img
                    key={index}
                    src={`${import.meta.env.BASE_URL}icons/Netflix.png`}
                    alt="Netflix"
                  />
                );
              } else if (s.name === "muse" || s.name === "Muse Asia") {
                return (
                  <img
                    key={index}
                    src={`${import.meta.env.BASE_URL}icons/Muse logo.png`}
                    alt="Muse Asia"
                  />
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </>
  );
}
