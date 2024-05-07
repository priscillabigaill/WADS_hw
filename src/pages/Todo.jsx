import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, Timestamp, query, where, onSnapshot, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { AuthContext } from "../AuthContext";
import { db } from '../firebase';
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { doc } from 'firebase/firestore';

function Todo() {
  const { user } = useContext(AuthContext) || {};
  const [userData, setUserData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editorMode, setEditorMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
          const userSnapshot = await getDocs(userQuery);
  
          if (userSnapshot.docs.length > 0) {
            const userData = userSnapshot.docs[0].data();
            setUserData(userData);
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

  useEffect(() => {
    let unsubscribe = () => {};
  
    if (user) {
      unsubscribe = onSnapshot(
        query(collection(db, 'tasks'), where("userId", "==", user.uid)),
        (snapshot) => {
          const tasks = [];
          snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          setTodos(tasks);
        }
      );
    }
  
    return () => {
      unsubscribe();
    };
  }, [user]);
  

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  // Define editTodo function
  async function editTodo(id, title) {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        title: title,
      });
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  }
  

  async function addTodo(title) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        title,
        completed: false, 
        created: Timestamp.now(),
        userId: user.uid,
      });
      console.log('Todo added with ID: ', docRef.id);
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  }
  
  function toggleTodo(id, completed) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    );
    setTodos(updatedTodos); // Update local state
  
    // Update Firestore database
    const todoRef = doc(db, 'tasks', id);
    updateDoc(todoRef, { completed })
      .then(() => {
        console.log('Todo updated successfully in Firestore');
      })
      .catch((error) => {
        console.error('Error updating todo in Firestore:', error);
      });
  }
  

  async function deleteTodo(id) {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  }

  function FilterButton(props) {
    return (
      <button
        type="button"
        className={`btn toggle-btn ${props.isPressed ? 'bg-violet-900 text-white' : 'bg-violet-200 text-black'} mx-2 my-1 mt-3`}
        aria-pressed={props.isPressed}
        onClick={() => props.setFilter(props.name)}>
        <span className="visually-hidden">Show </span>
        <span>{props.name}</span>
        <span className="visually-hidden"> tasks</span>
      </button>
    );
  }
  
  return (
    <>
      <div className="bg-white p-5 rounded-lg w-full mt-3">
        <TodoForm addTodo={addTodo} />
      </div>
      <div className="bg-white p-5 rounded-lg w-full mt-7">
        {Object.keys(FILTER_MAP).map((name) => (
          <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
          />
        ))}
        <div className="bg-white border border-violet-900 p-5 rounded-lg mt-7">
          <TodoList
            todos={todos.filter(FILTER_MAP[filter])}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            editorMode={editorMode}
          />
        </div>
      </div>
      <button
        className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3 mb-3 mr-3"
        onClick={() => setEditorMode(!editorMode)}
      >
        {editorMode ? "Exit Editor" : "Editor"}
      </button>
      <Link to="/">
        <button className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3">
          Back
        </button>
      </Link>
    </>
  );
}

export default Todo;
