import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header.jsx";
import SignUpPage from "./pages/sign-up-page/SignUpPage.jsx";

function App() {

  return (
      <Router>
          <div className="app">
              <Header />
              <Routes>
                  <Route path="/signup" element={<SignUpPage />} />
              </Routes>
          </div>
      </Router>
  )
}

export default App