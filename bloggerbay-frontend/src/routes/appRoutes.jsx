import DashboardPage from "../pages/dashboard/Dashboard";
import HomePage from "../pages/users/Users";
import ComponentPageLayout from "../pages/component/ComponentPageLayout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AlertPage from "../pages/component/AlertPage";
import ButtonPage from "../pages/component/ButtonPage";
import DocumentationPage from "../pages/documentation/DocumentationPage";
import CategoryIcon from "@mui/icons-material/Category";
import React from "react";
import UsersPage from "../pages/users/Users";
import Login from "../pages/LoginPage/LoginPage";
import SignUp from "../pages/SignupPage/SignupPage";

const appRoutes = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />,
    },
  },
  {
    path: "/category",
    element: <ComponentPageLayout />,
    state: "category",
    sidebarProps: {
      displayText: "Categories",
      icon: <CategoryIcon />,
    },
    child: [
      {
        path: "/category/acedamic_resources",
        element: <DashboardPage />,
        state: "category.academic_resources",
        sidebarProps: {
          displayText: "Academic Resources",
        },
      },
      {
        path: "/category/career_services",
        element: <DashboardPage />,
        state: "category.career_services",
        sidebarProps: {
          displayText: "Career Services",
        },
      },
      {
        path: "/category/campus_culture",
        element: <DashboardPage />,
        state: "category.campus_culture",
        sidebarProps: {
          displayText: "Campus Culture",
        },
      },
      {
        path: "/category/local_community_resources",
        element: <DashboardPage />,
        state: "category.local_community_resources",
        sidebarProps: {
          displayText: "Local Community Resources",
        },
      },
      {
        path: "/category/social",
        element: <DashboardPage />,
        state: "category.social",
        sidebarProps: {
          displayText: "Social",
        },
      },
      {
        path: "/category/health_and_wellness",
        element: <DashboardPage />,
        state: "category.health_and_wellness",
        sidebarProps: {
          displayText: "Health and wellness",
        },
      },
      {
        path: "/category/sports",
        element: <DashboardPage />,
        state: "category.sports",
        sidebarProps: {
          displayText: "Sports",
        },
      },
      {
        path: "/category/technology",
        element: <DashboardPage />,
        state: "category.technology",
        sidebarProps: {
          displayText: "Technology",
        },
      },
      {
        path: "/category/travel",
        element: <DashboardPage />,
        state: "category.travel",
        sidebarProps: {
          displayText: "Travel",
        },
      },
      {
        path: "/category/alumni",
        element: <DashboardPage />,
        state: "category.alumni",
        sidebarProps: {
          displayText: "Alumni",
        },
      },
    ],
  },
  {
    path: "/users",
    element: <UsersPage />,
    state: "users",
    sidebarProps: {
      displayText: "Users",
      icon: <ArticleOutlinedIcon />,
      isDisabled: !localStorage.getItem("role") === "admin",
    },
  },
];

export default appRoutes;
