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

/**
 * 
 * With Apollo Client, you can send queries in 2 different ways.

    1 - Using the query method directly and then process the response.
    2 - New useQuery React hook with React. (Recommended)
 */

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
      <Header logoutHandler={logout} />
      <div className="row container-fluid p-left-right-0 m-left-right-0">
        <div className="row col-md-9 p-left-right-0 m-left-right-0">
          <div className="col-md-6 sliderMenu p-30">
            <TodoPrivateWrapper />
          </div>
          <div className="col-md-6 sliderMenu p-30 bg-gray border-right">
            <TodoPublicWrapper />
          </div>
        </div>
        <div className="col-md-3 p-left-right-0">
          <div className="col-md-12 sliderMenu p-30 bg-gray">
            <OnlineUsersWrapper />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
