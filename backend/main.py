from fastapi import FastAPI, HTTPException, Path
from typing import Dict, List, Optional
from pydantic import BaseModel

app = FastAPI()

todos = []

class Todo(BaseModel):
    id: int
    title: str
    completed: bool

@app.post("/todos/", response_model=Todo)
def create_todo(todo: Todo):
    todos.append(todo)
    return todo

@app.get("/todos/", response_model=List[Todo])
def read_todos():
    return todos

@app.get("/todos/{todo_id}", response_model=Todo)
def read_todo(todo_id: int = Path(..., title="The ID of the todo to read")):
    todo = next((todo for todo in todos if todo.id == todo_id), None)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo: Todo):
    index = next((i for i, t in enumerate(todos) if t.id == todo_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todos[index] = todo
    return todo

@app.delete("/todos/{todo_id}", response_model=Todo)
def delete_todo(todo_id: int):
    index = next((i for i, t in enumerate(todos) if t.id == todo_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todos.pop(index)

@app.get("/todos/uncompleted", response_model=List[Todo])
def read_uncompleted_todos():
    return [todo for todo in todos if not todo.completed]

@app.get("/todos/completed", response_model=List[Todo])
def read_completed_todos():
    return [todo for todo in todos if todo.completed]

@app.put("/todos/{todo_id}/toggle", response_model=Todo)
def toggle_todo_status(todo_id: int):
    todo = next((todo for todo in todos if todo.id == todo_id), None)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.completed = not todo.completed
    return todo
