import { useEffect, useState } from "react";
import axios from "axios";
import "./media.css";

const YT_KEY = import.meta.env.VITE_YT_API_KEY;

export function Media({ anime }) {
  
  const [trailerUrl, setTrailerUrl] = useState(null);

  useEffect(() => {
    if (!anime) return;

    async function fetchTrailer() {
      try {
        const query = `${anime.title_english || anime.title} anime official English trailer`;

        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: query,
              key: YT_KEY,
              maxResults: 1,
              type: "video",
            },
          }
        );

        const ytVideoId = res.data.items[0]?.id?.videoId;

        if (ytVideoId) {
          // ✅ English trailer
          setTrailerUrl(`https://www.youtube.com/embed/${ytVideoId}`);
          
          return;
        }

        // 🟡 Fallback to Japanese trailer from Jikan
        if (anime.trailer?.embed_url) {
          setTrailerUrl(anime.trailer.embed_url);
          
          return;
        }

        // ❌ Nothing available
        setTrailerUrl(null);
        
      } catch (err) {
        console.error("YouTube fetch failed", err);

        // Even if YouTube fails, try Jikan trailer
        if (anime.trailer?.embed_url) {
          setTrailerUrl(anime.trailer.embed_url);
          
        } else {
          setTrailerUrl(null);
          
        }
      }
    }

    fetchTrailer();
  }, [anime]);

  if (!anime) {
    return <p style={{ color: "white" }}>Loading anime…</p>;
  }

  return (
    <div className="mediaContainer">
      {trailerUrl ? (
        <>
          <iframe
            src={trailerUrl}
            title={anime.title}
            allow="encrypted-media"
            allowFullScreen
          />
        </>
      ) : (
        <p style={{ color: "white" }}>
          Trailer not available 😕
        </p>
      )}
      
    </div>
  );
}
