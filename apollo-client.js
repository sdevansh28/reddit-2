import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.ENDPOINT_URI,
    headers: {
      Authorization: `apikey ${process.env.NEXT_PUBLIC_API_KEY}`
    },
    cache: new InMemoryCache(),
});

export default client;