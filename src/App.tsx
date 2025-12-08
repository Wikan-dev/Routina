import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Page1 from "./pages/page1";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user/:uid" element={<Dashboard />} />
        <Route path="/page" element={<Page1 />} />
      </Routes>
    </BrowserRouter>
  );
}