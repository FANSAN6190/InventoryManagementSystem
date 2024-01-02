import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function checkLoginStatus() {
    return fetch('/check-login-status', { method: "GET", credentials: 'include' })
        .then((response) => response.json())
        .then((data) => {
            return data.isAuthenticated;
        })
        .catch(error => console.error('Error:', error));
}

function withAuthCheck(Component, authenticated) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);
        
        useEffect(() => {
            
            checkLoginStatus().then((isAuthenticated) => {
                if (!isAuthenticated) {
                    navigate('/login');
                    console.log("redirecting to login page");
                    //window.location.href="http://localhost:5600/login"
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
    }
}

export default withAuthCheck;
export { checkLoginStatus };