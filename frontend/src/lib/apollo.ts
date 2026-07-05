import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { supabase } from "./supabase";

const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) {
    throw new Error("Missing VITE_API_URL")
}

const httpLink = new HttpLink({
    uri: apiUrl,
})

const authLink = new SetContextLink(async (prevContext) => {
    // sessionからアクセストークンを取得
    const {data} = await supabase.auth.getSession()
    const token = data.session?.access_token

    // headerにtokenを付与してreturn
    return {
        headers: {
            ...prevContext.headers,
            ...(token ? {authorization: `Bearer ${token}`}: {})
        },
    }
})


export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})