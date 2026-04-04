import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./comments.css";

export default function Comments() {
  // State for the list of comments
  const [data, setData] = useState([]);
  // State for the new comment input
  const [content, setContent] = useState("");
  
  // Gets the anime ID from the URL (Fixes the hardcoded '21' issue)
  const { id } = useParams();

  // 1️⃣ Extract the fetch logic into its own function so we can call it multiple times
  const fetchComments = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/comments/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 2️⃣ Fetch comments when the component first loads
  useEffect(() => {
    fetchComments();
  }, [id]);

  // 3️⃣ Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/comments/add`,
        {
          animeId: Number(id),
          content: content,
        },
        {
          withCredentials: true,
        }
      );

      // ✅ Clear the input field
      setContent(""); 
      
      // ✅ REFRESH THE COMMENTS LIST INSTANTLY without reloading the page!
      fetchComments(); 

    } catch (err) {
    if (err.response?.status === 401) {
        alert("Please log in to Comment");
    }
      console.error(err);
    }
  };

  return (
    <div className="commentContainer">
     <h1 id="reviews">Reviews</h1>
      {/* --- THE COMMENT FORM --- */}
      <form onSubmit={handleSubmit} className="commentForm">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="btn-submit">Post</button>
      </form>

      {/* --- THE COMMENTS LIST --- */}
      {data.map((d) => {
        return (
          <div key={d._id} className="commentBox">
            <div className="commentUsername">
              <p>{d.username}</p>
              <p>{new Date(d.createdAt).toDateString()}</p>
            </div>

            <div className="commentContent">
              <p>{d.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}