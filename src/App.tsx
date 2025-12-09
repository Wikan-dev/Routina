import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Page1 from "./pages/page1";
import Starto from "./pages/stato";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Starto />} />
        <Route path="/user/:uid" element={<Page1 />} />
        <Route path="/page" element={<Page1 />} />
      </Routes>
    </BrowserRouter>
  );
}