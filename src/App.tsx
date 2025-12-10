import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Page1 from "./pages/page1";
import Starto from "./pages/stato";
import AddHabit from "./component/add_habit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Starto />} />
        <Route path="/user/:uid" element={<Page1 />} />
        <Route path="/page" element={<Page1 />} />
        <Route path="/addhabit" element={<AddHabit />} />
      </Routes>
    </BrowserRouter>
  );
}