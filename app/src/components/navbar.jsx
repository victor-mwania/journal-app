import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from './auth';

function NavBar() {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    logout()
    return navigate('/login')
  };
  
  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1 text-4xl App-logo ">
          <h1>Journal</h1>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end text-cyan-500">
          <button  onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
