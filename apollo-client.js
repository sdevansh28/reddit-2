import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  //paste your stepzen uri here
    uri: 'https://beecher.stepzen.net/api/endpoint/__graphql',
    headers: {
      Authorization: `apikey ${process.env.NEXT_PUBLIC_API_KEY}`
    },
    cache: new InMemoryCache(),
});

export default client;