import React, { useState } from 'react'; // Import useState
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; 


const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear error state
    setSuccessMessage(null); // Clear success message state

    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Add user data to Firestore and get reference to the document
      const docRef = await addDoc(collection(db, 'users'), {
        fullName: fullName,
        uid: user.uid,
        email: email,
      });

      setSuccessMessage('Successfully registered');
    } catch (error) {
      console.log("Error:", error); // Log the error object
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Email address is already in use.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
        <div>
          <h1 className="text-purple-900 text-2xl font-semibold mb-3">Sign Up</h1>
        </div>
        <div className="mb-4">
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div className="mb-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div className="mb-6">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div>
          <button onClick={handleSignUp} className="bg-green-300 hover:bg-green-200 text-green-800 font-bold py-2 px-4 border-b-4 border-green-500 hover:border-green-500 rounded">Sign Up</button>
        </div>
        {successMessage && <p className="text-green-500 bg-green-100 py-2 px-4 rounded mt-4">{successMessage}</p>} {/* Display success message */}
        {error && <p className="text-red-500 bg-red-100 py-2 px-4 rounded mt-4">{error}</p>} {/* Style error message */}
        <div className="mt-4">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-purple-900 font-semibold">Login</Link></p>
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

export default Register;