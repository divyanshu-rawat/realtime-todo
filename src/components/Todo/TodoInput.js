import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_MY_TODOS } from "./TodoPrivateList";

const ADD_TODO = gql`
  mutation($todo: String!, $isPublic: Boolean!) {
    insert_todos(objects: { title: $todo, is_public: $isPublic }) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;

// eslint-disable-next-line react/prop-types
const TodoInput = ({ isPublic = false }) => {
  const [todoInput, setTodoInput] = useState("");
  const [addTodo] = useMutation(ADD_TODO, {
    update: updateCache,
    onCompleted: resetInput
  });
  //  It receives the result of the mutation (data) and the current cache (store) as arguments.
  const updateCache = (cache, { data }) => {
    if (isPublic) {
      return null;
    }

    const existingTodos = cache.readQuery({
      query: GET_MY_TODOS
    });
    console.log("data", data);
    const newTodo = data.insert_todos.returning[0];
    cache.writeQuery({
      query: GET_MY_TODOS,
      data: { todos: [newTodo, ...existingTodos.todos] }
    });
  };

  const resetInput = () => {
    setTodoInput("");
  };

  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addTodo({ variables: { todo: todoInput, isPublic } });
      }}
    >
      <input
        className="input"
        placeholder="What needs to be done?"
        value={todoInput}
        onChange={e => setTodoInput(e.target.value)}
      />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
