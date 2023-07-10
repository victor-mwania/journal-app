import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './components/auth';
import SignUpPage from "./pages/signup";
import LoginPage from "./pages/login";
import Journal from "./pages/journal";


import "./App.css";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Journal />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
