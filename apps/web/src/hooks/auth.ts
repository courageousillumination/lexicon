import { getSupabase } from "../lib/supabase";

const useSignIn = () => {
  const signIn = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    return error ? Promise.reject(error) : Promise.resolve();
  };

  return signIn;
};

const useSignOut = () => {
  const signOut = async () => {
    await getSupabase().auth.signOut();
  };

  return signOut;
};

export { useSignIn, useSignOut };
