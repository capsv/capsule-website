import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Header from "./components/Header.jsx";

function App() {

  return (
      <Router>
          <Header />
          <Routes>
              <Route path="/home" element={<Home/>}/>
          </Routes>
      </Router>
  )
}

export default App
