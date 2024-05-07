import PageWrapper from "../components/PageWrapper/PageWrapper";
import appRoutes from "./appRoutes";
import { Route } from "react-router-dom";
import React from "react";
import Login from "../pages/LoginPage/LoginPage";
import SignUp from "../pages/SignupPage/SignupPage";

const generateRoute = (routes) => {
  return routes.map((route, index) =>
    route.index ? (
      <Route
        index
        path={route.path}
        element={<PageWrapper state={route.state}>{route.element}</PageWrapper>}
        key={index}
      />
    ) : (
      <Route
        path={route.path}
        element={
          <PageWrapper state={route.child ? undefined : route.state}>
            {route.element}
          </PageWrapper>
        }
        key={index}
      >
        {route.child && generateRoute(route.child)}
      </Route>
    )
  );
};

const LoginRoute = <Route path={"/signin"} element={<Login />} />;
const SignupRoute = <Route path={"/signup"} element={<SignUp />} />;

const routesMap = generateRoute(appRoutes) || [];
routesMap.push(LoginRoute, SignupRoute);
export const routes = generateRoute(appRoutes);
