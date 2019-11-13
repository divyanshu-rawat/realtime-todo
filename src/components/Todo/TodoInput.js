import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
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
  const [addTodo] = useMutation(ADD_TODO);

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
