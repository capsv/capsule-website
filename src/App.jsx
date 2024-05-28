import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header.jsx";
import SignUpPage from "./pages/sign-up-page/SignUpPage.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignInPage from "./pages/sign-in-page/SignInPage.jsx";

function App() {

  return (
      <Router>
          <div className="app">
              <Header />
              <Routes>
                  <Route path="/auth/up" element={<SignUpPage />} />
                  <Route path="/auth/in" element={<SignInPage />} />
              </Routes>
          </div>
      </Router>
  )
}

export default App