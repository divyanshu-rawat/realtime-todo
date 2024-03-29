import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_MY_TODOS } from "./TodoPrivateList";

const TodoItem = ({ index, todo }) => {
  const removeTodo = e => {
    deleteTodoMutation({
      variables: { id: todo.id },
      optimisticResponse: null
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const TOGGLE_TODO = gql`
    mutation toggleTodo($id: Int!, $isCompleted: Boolean!) {
      update_todos(
        where: { id: { _eq: $id } }
        _set: { is_completed: $isCompleted }
      ) {
        affected_rows
      }
    }
  `;

  const DELETE_TODO = gql`
    mutation removeTodo($id: Int!) {
      delete_todos(where: { id: { _eq: $id } }) {
        affected_rows
      }
    }
  `;

  //  It receives the result of the mutation (data) and the current cache (store) as arguments.
  const updateCache = cache => {
    const existingTodos = cache.readQuery({
      query: GET_MY_TODOS
    });

    const newTodos = existingTodos.todos.map(t => {
      if (t.id === todo.id) {
        return { ...t, is_completed: !t.is_completed };
      } else {
        return t;
      }
    });

    cache.writeQuery({
      query: GET_MY_TODOS,
      data: { todos: newTodos }
    });
  };

  const [toggleTodoMutation] = useMutation(TOGGLE_TODO, {
    update: updateCache
  });

  const toggleTodo = () => {
    toggleTodoMutation({
      variables: {
        id: todo.id,
        isCompleted: !todo.isCompleted
      },
      optimisticResponse: null
    });
  };

  const [deleteTodoMutation] = useMutation(DELETE_TODO, {
    update: cache => {
      const existingTodos = cache.readQuery({ query: GET_MY_TODOS });
      console.log(existingTodos);
      const newTodos = existingTodos.todos.filter(t => {
        return t.id != todo.id;
      });

      cache.writeQuery({
        query: GET_MY_TODOS,
        data: { todos: newTodos }
      });
    }
  });

  return (
    <li>
      <div className="view">
        <div className="round">
          <input
            checked={todo.is_completed}
            type="checkbox"
            id={todo.id}
            onChange={toggleTodo}
          />
          <label htmlFor={todo.id} />
        </div>
      </div>

      <div className={"labelContent" + (todo.is_completed ? " completed" : "")}>
        <div>{todo.title}</div>
      </div>

      <button className="closeBtn" onClick={removeTodo}>
        x
      </button>
    </li>
  );
};

export default TodoItem;
