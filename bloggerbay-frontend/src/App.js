import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout/Layout";
import { routes } from "./routes";
import Login from "./pages/LoginPage/LoginPage";
import SignUp from "./pages/SignupPage/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/signin"} element={<Login />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route exact path={"/"} element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
