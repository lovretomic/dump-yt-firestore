import clsx from "clsx";
import styles from "./Todo.module.css";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { TodoProps } from "../../types";

type Props = {
  id: string;
  text: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Todo: React.FC<Props> = ({ id, text, ...handlers }) => {
  const [isChecked, setIsChecked] = useState(handlers.checked);

  const labelStyles = clsx({
    [styles.label]: true,
    [styles.checked]: isChecked,
  });

  async function toggleTodo() {
    const checkedTodo: TodoProps = {
      id: id,
      text: text,
      isChecked: !isChecked,
    };

    try {
      const todoRef = doc(collection(db, "todos"), id);
      await setDoc(todoRef, checkedTodo);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteTodo() {
    try {
      const todoRef = doc(collection(db, "todos"), id);
      await deleteDoc(todoRef);
    } catch (err) {
      console.error(err);
    }
  }

  function handleCheckboxChange() {
    toggleTodo();
    setIsChecked(!isChecked);
  }

  useEffect(() => {
    setIsChecked(handlers.checked);
  }, [handlers.checked]);

  return (
    <div className={styles.checkboxWrapper}>
      <div className={styles.checkboxContent}>
        <input
          id={id}
          type="checkbox"
          onChange={handleCheckboxChange}
          {...handlers}
        />
        <label htmlFor={id} className={labelStyles}>
          {text}
        </label>
      </div>

      <button onClick={deleteTodo}>Izbriši</button>
    </div>
  );
};

export default Todo;
