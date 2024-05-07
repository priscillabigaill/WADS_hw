import { auth, db, googleAuthProvider} from '../firebase'; 
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { AuthContext } from '../AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; 

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Authenticate user with Firebase
    const userCredential = await signInWithEmailAndPassword(email, password);

    if (userCredential && userCredential.user) {
      setIsLoggedIn(true);
    } else {
      setError("Authentication failed");
    }
  } catch (error) {
    console.error('Error:', error); // Debugging: Log error
    setError(error.message);
  }
};
  
  
  useEffect(() => {
    console.log('User:', user); // Debugging: Check user object
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn); // Debugging: Check isLoggedIn state
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  const handleGoogleLogin = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleAuthProvider); 
  
      // Get user information
      const user = result.user;
  
      // Check if user exists in Firestore collection
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      // If user does not exist, add them to Firestore collection
      if (querySnapshot.empty) {
        const userData = {
          uid: user.uid,
          email: user.email,
          // Add more user data as needed
          fullName: user.displayName // Assuming displayName is the full name
        };
        await addDoc(usersCollection, userData);
      }
  
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
      <form onSubmit={handleLogin} className='flex flex-col items-center justify-center'>
        <div>
          <h1 className="text-purple-900 text-2xl font-semibold mb-3">Login</h1>
        </div>
        <div className="mb-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }}  />
        </div>
        <div className="mb-6">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div>
          <button type="submit" className="bg-blue-300 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 border-b-4 border-blue-500 hover:border-blue-500 rounded">Login</button>
        </div>
        </form>
        {error && <p className="text-red-500 bg-red-100 py-2 px-4 rounded mt-2">{error}</p>} {/* Style error message */}
        <p className='text-black mt-2'>or</p>
        <div className="mt-1">
          {/* Button for Google sign-in */}
          <button onClick={handleGoogleLogin} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sign In with Google</button>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-purple-900 font-semibold">Sign up</Link></p>
        </div>
        <div className="mt-4">
          <Link to="/" className="text-purple-900 font-semibold">Back to Home</Link>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 p-4 text-sky-900 font-bold">
          <h3>Priscilla Abigail Munthe - 2602109883</h3>
      </div>
    </div>
  );
}

export default Login;
