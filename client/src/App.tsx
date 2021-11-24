import "./App.css";
import FeedPage from "./pages/FeedPage";
import SubmitPage from "./pages/submitpage/SubmitPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/" element={<FeedPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
