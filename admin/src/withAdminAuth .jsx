import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import database from './Utils/handelDatabase';

const withAdminAuth = (Component) => {
  return (props) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAdmin = async () => {
        const loggedInUser = sessionStorage.getItem('user');
        if (loggedInUser) {
          const user = JSON.parse(loggedInUser);
          const currentUserData = await database.fetchUserDataByCode(user.uid);
          setCurrentUser(currentUserData);
          setLoading(false);
        } else {
          const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
              sessionStorage.setItem('user', JSON.stringify(user));
              const currentUserData = await database.fetchUserDataByCode(user.uid);
              setCurrentUser(currentUserData);
            } else {
              setCurrentUser(null);
            }
            setLoading(false);
          });
          return () => unsubscribe();
        }
      };

      checkAdmin();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (currentUser?.role === 'admin') {
      return <Component {...props} />;
    }

    return <Navigate to="/SignIn" />;
  };
};

export default withAdminAuth;
