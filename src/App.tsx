import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Login } from "./components/Login";
import { ForgotPassword } from "./components/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;