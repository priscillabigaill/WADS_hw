import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { db, storage } from '../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function Profile() {
  const { user } = useContext(AuthContext) || {};
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
          const userSnapshot = await getDocs(userQuery);
  
          if (userSnapshot.docs.length > 0) {
            const userData = userSnapshot.docs[0].data();
            const userDocId = userSnapshot.docs[0].id;
            setUserData(userData);
            setEditedUserData({ ...userData, docId: userDocId });
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };
  
    const fetchProfilePicture = async () => {
      try {
        if (user && user.uid) {
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          const imageUrl = await getDownloadURL(storageRef);
          setProfilePictureUrl(imageUrl);
        }
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          // Profile picture does not exist
          setProfilePictureUrl(null);
        } else {
          console.error('Error fetching profile picture:', error.message);
        }
      }
    };
  
    if (user) {
      fetchUserData();
      fetchProfilePicture();
    }
  }, [user]);
  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    try {
      const userDocRef = doc(db, 'users', editedUserData.docId);
      await updateDoc(userDocRef, editedUserData);
      setUserData(editedUserData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleUpload = async () => {
    try {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, profilePicture);
      console.log('Profile picture uploaded successfully!');
      const imageUrl = await getDownloadURL(storageRef);
      setProfilePictureUrl(imageUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
        <h1 className="text-purple-900 text-2xl font-semibold mb-3">Profile Page</h1>
        {userData ? (
          <div className="text-black">
            {isEditing ? (
              <>
              <div className='bg-gray-200 p-10 m-3'>
                <p><strong>Full Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    name="fullName"
                    value={editedUserData.fullName}
                    onChange={handleInputChange}
                  />
                </p>
                <p className='mt-5'><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input
                    type="text"
                    name="email"
                    value={editedUserData.email}
                    onChange={handleInputChange}
                  />
                </p>
                <div className='mt-5'>
                <input type="file" onChange={handleFileInputChange} />
                <button className='border border-gray-500 rounded px-4 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800 mt-2' onClick={handleUpload}>Upload Profile Picture</button>
                </div>
              </div>
                <button className="bg-green-300 hover:bg-green-200 text-green-800 font-bold py-2 px-4 border-b-4 border-green-500 hover:border-green-500 rounded mt-3 mr-3 ml-3" onClick={handleSave}>Save</button>
              </>
            ) : (
              <>
              <div className='flex flex-col items-center justify-center'>
                {profilePictureUrl ? (
                  <img src={profilePictureUrl} alt="Profile Picture" style={{ width: '100px', height: '100px' }} />
                ) : (
                  <div style={{ width: '100px', height: '100px', backgroundColor: 'lightgray', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}>no profile yet</div>

                )}
              </div>
              <div  className='bg-gray-200 p-10 m-3'>
              <p><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userData.email}</p>
              <p><strong>Full Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userData.fullName}</p>
              </div>
                <button className="bg-green-300 hover:bg-green-200 text-green-800 font-bold py-2 px-4 border-b-4 border-green-500 hover:border-green-500 rounded mt-3 mr-3 ml-3" onClick={handleEdit}>Edit</button>
                <Link to="/">
                  <button className="bg-blue-300 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 border-b-4 border-blue-500 hover:border-blue-500 rounded mt-3 mr-3">Back</button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
}
