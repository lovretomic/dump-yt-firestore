import styles from "./App.module.css";
import { useState, useRef, useEffect } from "react";
import Todo from "./components/Todo";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { db } from "./components/firebaseConfig";

import { v4 as uuidv4 } from "uuid";
import { TodoProps } from "./types";

function App() {
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "todos"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const todos: TodoProps[] = [];
      querySnapshot.forEach((doc) => {
        todos.push({
          id: doc.id,
          text: doc.data().text,
          isChecked: doc.data().isChecked,
        });
      });
      setTodos(todos);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    inputRef.current!.value = "";
  }, [todos]);

  async function addTodo() {
    if (!inputRef.current!.value) {
      alert("Upiši zadatak!");
      return;
    }

    const newTodo: TodoProps = {
      id: uuidv4(),
      text: inputRef.current!.value,
      isChecked: false,
    };

    await setDoc(doc(db, "todos", newTodo.id), newTodo);
  }

  return (
    <div className={styles.app}>
      <h1>Todo App</h1>
      <div className={styles.inputWrapper}>
        <input type="text" placeholder="Upiši zadatak..." ref={inputRef} />
        <button onClick={addTodo}>Dodaj</button>
      </div>

      <p>Novi zadaci</p>
      <div className={styles.todosWrapper}>
        {todos.filter((todo) => !todo.isChecked).length === 0 && (
          <p className={styles.noTodos}>Nema zadataka</p>
        )}
        {todos
          .filter((todo) => !todo.isChecked)
          .map((todo) => (
            <Todo
              key={todo.id}
              id={todo.id}
              text={todo.text}
              checked={todo.isChecked}
            />
          ))}
      </div>

      <p>Rješeni zadaci</p>
      <div className={styles.todosWrapper}>
        {todos.filter((todo) => todo.isChecked).length === 0 && (
          <p className={styles.noTodos}>Nema zadataka</p>
        )}
        {todos
          .filter((todo) => todo.isChecked)
          .map((todo) => (
            <Todo
              key={todo.id}
              id={todo.id}
              text={todo.text}
              checked={todo.isChecked}
            />
          ))}
      </div>
    </div>
  );
}

export default App;
