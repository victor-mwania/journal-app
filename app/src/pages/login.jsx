import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../components/auth';



function LoginPage() {
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://journal-app-fmttxbcw2a-nw.a.run.app//user/login", {
        emailAddress,
        password,
      });
      if (response.status === 200) {
        login()
        localStorage.setItem("x-journal-token", response.data.body.token);
        return navigate("/");
      }
    } catch (error) {
      console.log("Sign-up Failed", error);
    }
  };

  if (isLoggedIn) {
    return navigate("/");
  }
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        <div></div>
        <div className="col-span-2">
          <div className="mt-28">
            <div className="mt-16">
              <div className="text-center">
                <div>
                  <h1 className="text-4xl font-semibold	">Welcome Back!</h1>
                </div>
                <div className="m-5">
                  <p className="font-light">
                    Enter your credentials to access your account.
                  </p>
                </div>
              </div>
              <div className="m-4 mx-32">
                <form onSubmit={handleSubmit}>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:outline-none my-2"
                      type="email"
                      value={emailAddress}
                      onChange={handleEmailChange}
                    />
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Email
                    </label>
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                      Password
                    </label>
                  </div>
                  <div>
                    <button
                      className="shadow bg-cyan-500	 hover:bg-cyan-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                  <div className="text-center my-5">
                    <span>or</span>
                    <div className="font-semibold text-lg">
                      <Link to="/signup">SignUp</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default LoginPage;
