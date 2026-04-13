import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./comments.css";

export default function Comments() {
  const [data, setData] = useState([]);
  const [content, setContent] = useState("");
  const [uid, setUid] = useState(null);

  const { id } = useParams();

  // fetch logged in user
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/user/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUid(res.data.data._id);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // fetch comments
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

  // fetch when page loads
  useEffect(() => {
    fetchComments();
  }, [id]);

  // add comment
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

      setContent("");
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

      {/* comment form */}
      <form onSubmit={handleSubmit} className="commentForm">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="btn-submit">
          Post
        </button>
      </form>

      {/* comments list */}
      {data.map((d) => {
        return (
          <div key={d._id} className="commentBox">
            <div className="commentUsername">
              <p>{d.username}</p>
              <p>{new Date(d.createdAt).toDateString()}</p>
            </div>

            {String(d.user) === String(uid) && (
              <div className="deleteBtn">
                <button>Delete</button>
              </div>
            )}

            <div className="commentContent">
              <p>{d.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}