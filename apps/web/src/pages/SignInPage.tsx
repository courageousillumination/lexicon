import {
  Box,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { IconBook2, IconLogin } from "@tabler/icons-react";

import { useForm } from "@mantine/form";
import { AuthContext } from "../contexts/AuthContext";
import { useSignIn } from "../hooks/auth";

export function SignInPage() {
  const { user, loading } = useContext(AuthContext)!;
  const signIn = useSignIn();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    await signIn(values.email, values.password);
    void navigate("/", { replace: true });
  });

  // Redirect if the user is already authenticated.
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      mih="100vh"
      px="md"
      style={{
        backgroundImage:
          "linear-gradient(155deg, var(--mantine-color-book-1) 0%, var(--mantine-color-book-0) 42%, #E8DCC8 100%)",
      }}
    >
      <Center mih="100vh">
        <Stack gap="xl" maw={420} w="100%">
          <Stack gap="xs" align="center">
            <IconBook2
              size={40}
              stroke={1.5}
              color="var(--mantine-color-book-7)"
            />
            <Title order={1} ta="center">
              Lexicon
            </Title>
          </Stack>

          <Paper p="xl" shadow="sm">
            <Stack gap="md">
              <Title order={2}>Sign in</Title>

              <form onSubmit={onSubmit}>
                <Stack gap="md">
                  <TextInput
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    label="Password"
                    name="password"
                    autoComplete="current-password"
                    required
                    minLength={6}
                    {...form.getInputProps("password")}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={form.submitting}
                    leftSection={<IconLogin size={16} stroke={1.6} />}
                  >
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Stack>
      </Center>
    </Box>
  );
}
