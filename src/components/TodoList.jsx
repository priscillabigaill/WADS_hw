import React from "react";
import { TodoItem } from "./TodoItem";

export function TodoList({ todos, toggleTodo, deleteTodo, editTodo, editorMode }) {
  return (
    <div className="mt-3">
      <ul className="list text-violet-900">
        {todos.length === 0 && <div>No todos available.</div>}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            editorMode={editorMode} // Pass editorMode prop to TodoItem
          />
        ))}
      </ul>
    </div>
  );
}
