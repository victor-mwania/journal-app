import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { AuthContext } from '../components/auth';
import axios from "axios";

function SignUpPage() {
  const [entry, setEntry] = useState("");
  const [characterCount, setCharacterCount] = useState(0)
  const { logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/login")
    }
  });
  const handleEntryChange = (e) => {
    setEntry(e.target.value);
    setCharacterCount(e.target.value.length)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("x-journal-token");
    if (token) {
      try {
        const response = await axios.post(
          "https://journal-app-fmttxbcw2a-nw.a.run.app//journal/create",
          {
            entry,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setEntry('');
        setCharacterCount(0);
      } catch (error) {
        if (error.response.status === 401) {
          logout()
          return navigate("/login");
        }
      }
    } else {
      return navigate("/login");
    }
  };


  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-3 gap-2 my-6">
        <div></div>
        <div>
          <div className="text-center">
            <div>
              <h1 className="text-4xl font-semibold	">
                Create new Journal Entry
              </h1>
            </div>
          </div>
          <div className="my-8">
            <form onSubmit={handleSubmit}>
              <div>
                <textarea
                  rows={4}
                  placeholder="Input journal entry"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={entry}
                  onChange={handleEntryChange}
                  maxLength={500}
                ></textarea>
              </div>
              <div className="flex flex-row-reverse">{characterCount}/500</div>
              <div className="flex flex-row-reverse my-6">
                <button
                  type="submit"
                  className="shadow bg-cyan-500	 hover:bg-cyan-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-32"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default SignUpPage;
