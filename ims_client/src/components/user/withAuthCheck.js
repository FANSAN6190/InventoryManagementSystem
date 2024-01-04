import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function checkLoginStatus() {
  return fetch("http://ims-server-dev.ap-south-1.elasticbeanstalk.com/check-login-status", { method: "GET", credentials: "include" })
    .then((response) => response.json())
    .then((data) => {
      console.log("User is authenticated:", data.isAuthenticated);
      return data.isAuthenticated;
    })
    .catch((error) => console.error("Error:", error));
}

function withAuthCheck(Component, authenticated) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      checkLoginStatus().then((isAuthenticated) => {
        if (!isAuthenticated) {
          navigate("/login");
          console.log("redirecting to login page");
          //window.location.href="/login"
        } else {
          console.log("user is authenticated");
          setIsLoading(false);
        }
      });
    }, [navigate]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

export default withAuthCheck;
export { checkLoginStatus };
