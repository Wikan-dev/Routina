import { Route, Routes, BrowserRouter } from "react-router-dom";
import LandingPages from "./pages/landingPages";
import LS from "./pages/LS";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route path="/ls" element={<LS />} />
      </Routes>
    </BrowserRouter>
  )
}