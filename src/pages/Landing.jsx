import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState, createContext } from 'react';
import { AuthContext } from '../AuthContext';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore'; 

import { db, auth } from '../firebase';


export default function Landing() {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(AuthContext) || {}; // Provide a default empty object
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // Add state for email
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
          const userSnapshot = await getDocs(userQuery);
  
          if (userSnapshot.docs.length > 0) {
            const userData = userSnapshot.docs[0].data();
            setFullName(userData.fullName);
            setEmail(userData.email);
            
            console.log('Full Name:', userData.fullName);
            console.log('Email:', userData.email);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };
  
    fetchUserData();
  }, [user]);  


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
        <div>
          <h1 className="text-purple-900 text-2xl font-semibold mb-3">Welcome{isLoggedIn && fullName ? `, ${fullName}!` : ''} ⸜(｡˃ ᵕ ˂ )⸝♡</h1>
        </div>
        <div className="flex justify-center">
          <Link to="/todo">
            <button className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3 mr-3">To-do</button>
          </Link>
          {isLoggedIn && (
            <Link to="/profile">
              <button className="bg-green-300 hover:bg-green-200 text-green-800 font-bold py-2 px-4 border-b-4 border-green-500 hover:border-green-500 rounded mt-3 mr-3">Profile</button>
            </Link>
            
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className="bg-red-300 hover:bg-red-200 text-red-800 font-bold py-2 px-4 border-b-4 border-red-500 hover:border-red-500 rounded mt-3 mr-3">Log out</button>
          )}
        </div>
        {!isLoggedIn && (
          <p className="mt-4 text-gray-600">
            Guest mode.<Link to="/login" className="text-yellow-800 hover:underline ml-1 font-bold">Login</Link> to save tasks!
          </p>
        )}
      </div>
      <div className="fixed bottom-0 left-0 p-4 text-sky-900 font-bold">
        <h3>Priscilla Abigail Munthe - 2602109883</h3>
      </div>
    </div>
  );
}