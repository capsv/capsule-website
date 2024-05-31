import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header.jsx";
import SignUpPage from "./pages/sign-up-page/SignUpPage.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignInPage from "./pages/sign-in-page/SignInPage.jsx";
import UserPage from "./pages/user-page/UserPage.jsx";
import HomePage from "./pages/home-page/HomePage.jsx";
import Footer from "./components/footer/Footer.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import './index.css';

function App() {

  return (
      <LanguageProvider>
          <Router>
              <div className="app">
                  <Header />
                  <main className="main-content">
                      <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/auth/up" element={<SignUpPage />} />
                          <Route path="/auth/in" element={<SignInPage />} />
                          <Route path="/:username" element={<UserPage />} />
                      </Routes>
                  </main>
                  <Footer />
              </div>
          </Router>
      </LanguageProvider>
  )
}

export default App