import { useState } from "react";

export function TodoForm({ addTodo }) {
  const [newItem, setNewItem] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (newItem === "") return;

    addTodo(newItem);
    setNewItem("");
  }

  return (
    <div>
      <form className="new-item-form">
        <div className="form-row">
          <div className="text-violet-900 text-2xl font-semibold mb-3 mt-4">
          <label htmlFor="item">Add new:</label>
          </div>
          <input 
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            style={{
              backgroundColor: '#ddd6fe',
              border: '1px solid #a78bfa',
              color: '#2e1065'
          }}
          />
        </div>
        <button className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3" onClick={handleSubmit}>
          Add
        </button>
      </form>
    </div>
  );
}
