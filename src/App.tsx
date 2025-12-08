import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Page1 from "./pages/page1";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user/:uid" element={<Page1 />} />
        <Route path="/page" element={<Page1 />} />
      </Routes>
    </BrowserRouter>
  );
}