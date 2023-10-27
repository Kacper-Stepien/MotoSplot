import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AppLayout from "./pages/AppLayout";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import MainPageLayout from "./pages/MainPageLayout";
import Notification from "./ui/Notification";
import OutletLayout from "./pages/OutletLayout";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import UserCloseAccountPage from "./pages/UserSettings/UserCloseAccountPage";
import UserFriendsInvitationsPage from "./pages/Friends/UserFriendsInvitationsPage";
import UserFriendsPage from "./pages/Friends/UserFriendsPage";
import UserFriendsPageLayout from "./pages/Friends/UserFriendsPageLayout";
import UserFriendsSuggestionsPage from "./pages/Friends/UserFriendsSuggestionsPage";
import UserPendingFriends from "./pages/Friends/UserPendingFriends";
import UserSettingsDataPage from "./pages/UserSettings/UserSettingsDataPage";
import UserSettingsPageLayout from "./pages/UserSettings/UserSettingsPageLayout";
import UserSettingsPhoto from "./pages/UserSettings/UserSettingsPhoto";
import UserSettingsPrivacyPage from "./pages/UserSettings/UserSettingsPrivacyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute element={<MainPageLayout />} />,
        children: [
          {
            path: "/",
            element: <MainPage />,
          },
          {
            path: "/articles",
            element: <p>Artykuły</p>,
          },
          {
            path: "/events",
            element: <p>Wydarzenia</p>,
          },
          {
            path: "/friends",
            element: <UserFriendsPageLayout />,
            children: [
              {
                path: "list",
                element: <UserFriendsPage />,
              },
              {
                path: "invitations",
                element: <UserFriendsInvitationsPage />,
              },
              {
                path: "suggestions",
                element: <UserFriendsSuggestionsPage />,
              },
              {
                path: "pending",
                element: <UserPendingFriends />,
              },
            ],
          },
          {
            path: "/bookmarks",
            element: <p>Zapisane</p>,
          },
          {
            path: "/forum",
            element: <p>Forum</p>,
          },
          {
            path: "/me",
            element: <OutletLayout />,
            children: [
              {
                path: "",
                element: <p>Profil</p>,
              },
              {
                path: "settings",
                element: <UserSettingsPageLayout />,
                children: [
                  {
                    path: "data",
                    element: <UserSettingsDataPage />,
                  },
                  {
                    path: "privacy",
                    element: <UserSettingsPrivacyPage />,
                  },
                  {
                    path: "close",
                    element: <UserCloseAccountPage />,
                  },
                  {
                    path: "photo",
                    element: <UserSettingsPhoto />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Notification />
    </>
  );
}

export default App;
