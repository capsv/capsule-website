import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home.jsx";

function App() {

  return (
      <Router>
          <ul>
              <li><Link to="/home">Home</Link></li>
          </ul>
          <Routes>
              <Route path="/home" element={<Home/>}/>
          </Routes>
      </Router>
  )
}

export default App
