import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header.jsx";
import SignUpPage from "./pages/sign-up-page/SignUpPage.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignInPage from "./pages/sign-in-page/SignInPage.jsx";
import UserPage from "./pages/user-page/UserPage.jsx";
import HomePage from "./pages/home-page/HomePage.jsx";

function App() {

  return (
      <Router>
          <div className="app">
              <Header />
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth/up" element={<SignUpPage />} />
                  <Route path="/auth/in" element={<SignInPage />} />
                  <Route path="/:username" element={<UserPage />} />
              </Routes>
          </div>
      </Router>
  )
}

export default App