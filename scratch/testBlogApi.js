import axios from "axios";

const test = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/blogs/beginners-guide-to-balanced-nutrition");
    console.log("Status:", res.status);
    console.log("Data title:", res.data.title);
    console.log("Data content snippet:", res.data.content ? res.data.content.slice(0, 100) : "null");
  } catch (err) {
    console.error("Error:", err.message);
  }
};

test();
