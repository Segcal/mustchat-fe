import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { Children, useEffect, useState } from "react";
import { useAppStore } from "./stores";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuchenticated = !!userInfo;
  return isAuchenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuchenticated = !!userInfo;
  return isAuchenticated ? <Navigate to="/chat" /> : children;
};

function App() {

const { userInfo, setUserInfo } = useAppStore();
const [loading, setLoadig] = useState(true)

useEffect(() => {
const getUserData = async () => {
  try {
    const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
    if(response.statusCode === 200 && response.data.id) {
      setUserInfo(response.data)
    } else {
      setUserInfo(undefined)
    } 
    console.log({ response });
  } catch(error) {
    setUserInfo(undefined)
  } finally {
    setLoadig(false)
  }
}

if(!userInfo) {
  getUserData()
} else {
  setLoadig(false)
}
}, [userInfo, setUserInfo])


if (loading) {
  return <div>loading.....</div>
}

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
