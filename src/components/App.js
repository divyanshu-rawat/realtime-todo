import React from "react";

import Header from "./Header";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";

import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";

import { useAuth0 } from "./Auth/react-auth0-spa";

const createApolloClient = authToken => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://learn.hasura.io/graphql",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }),
    cache: new InMemoryCache()
  });
};

const App = ({ idToken }) => {
  const { loading, logout } = useAuth0();
  if (loading) {
    return <div>Loading...</div>;
  }

  const client = createApolloClient(idToken);
  return (
    <ApolloProvider client={client}>
      <div />
    </ApolloProvider>
  );
};

export default App;
