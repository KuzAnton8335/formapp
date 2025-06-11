import { Route, Routes } from "react-router-dom";
import "./App.css";
import { FormPage } from "./pages/formPage/FormPage";
import { LoginPage } from "./pages/loginPage/LoginPage";
import { TablePage } from "./pages/tablePage/TablePage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/table" element={<TablePage />} />
    </Routes>
  );
};

export default App;
