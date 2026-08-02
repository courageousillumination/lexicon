import { useContext, useState } from "react";
import {
  Alert,
  Button,
  Center,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBook2, IconPencil } from "@tabler/icons-react";
import {
  LANGUAGE_OPTIONS,
  languageLabel,
  type LanguageCode,
  type Lexicon,
} from "@lexicon/shared/model";
import {
  useCreateLexicon,
  useLexicons,
  useUpdateLexicon,
} from "../../api/lexicon";
import { LexiconContext } from "../../contexts/LexiconContext";

const LANGUAGE_SELECT_DATA = LANGUAGE_OPTIONS.map((option) => ({
  value: option.code,
  label: option.label,
}));

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}

type LexiconFormValues = {
  name: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

const lexiconFormValidate = {
  name: (value: string) => (value.trim().length === 0 ? "Enter a name" : null),
  sourceLanguage: (value: string) =>
    isLanguageCode(value) ? null : "Select a source language",
  targetLanguage: (value: string) =>
    isLanguageCode(value) ? null : "Select a target language",
};

function CreateLexiconForm({ onCreated }: { onCreated: (id: string) => void }) {
  const createLexicon = useCreateLexicon();
  const form = useForm<LexiconFormValues>({
    initialValues: {
      name: "",
      sourceLanguage: "en-US",
      targetLanguage: "zh-CN",
    },
    validate: lexiconFormValidate,
  });

  const error = errorMessage(createLexicon.error, "Unable to create lexicon");

  const onSubmit = form.onSubmit(async (values) => {
    const created = await createLexicon.mutateAsync({
      name: values.name.trim(),
      sourceLanguage: values.sourceLanguage,
      targetLanguage: values.targetLanguage,
    });
    form.reset();
    onCreated(created.id);
  });

  return (
    <Paper
      p="lg"
      component="section"
      aria-labelledby="create-lexicon-heading"
    >
      <Stack gap="md">
        <Title order={2} id="create-lexicon-heading">
          Create lexicon
        </Title>
        <form onSubmit={onSubmit}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              name="name"
              required
              placeholder="e.g. Mandarin"
              {...form.getInputProps("name")}
            />
            <Group grow align="flex-start">
              <Select
                label="Source language"
                name="sourceLanguage"
                required
                data={LANGUAGE_SELECT_DATA}
                allowDeselect={false}
                {...form.getInputProps("sourceLanguage")}
              />
              <Select
                label="Target language"
                name="targetLanguage"
                required
                data={LANGUAGE_SELECT_DATA}
                allowDeselect={false}
                {...form.getInputProps("targetLanguage")}
              />
            </Group>
            <Group justify="flex-end">
              <Button type="submit" loading={form.submitting}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
        {error ? (
          <Alert color="red" title="Something went wrong">
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}

function EditLexiconRow({ lexicon }: { lexicon: Lexicon }) {
  const updateLexicon = useUpdateLexicon();
  const [editing, setEditing] = useState(false);
  const form = useForm<LexiconFormValues>({
    initialValues: {
      name: lexicon.name,
      sourceLanguage: lexicon.sourceLanguage,
      targetLanguage: lexicon.targetLanguage,
    },
    validate: lexiconFormValidate,
  });

  const error = errorMessage(updateLexicon.error, "Unable to update lexicon");

  const onSubmit = form.onSubmit(async (values) => {
    await updateLexicon.mutateAsync({
      id: lexicon.id,
      name: values.name.trim(),
      sourceLanguage: values.sourceLanguage,
      targetLanguage: values.targetLanguage,
    });
    setEditing(false);
  });

  function syncFormFromLexicon() {
    form.setValues({
      name: lexicon.name,
      sourceLanguage: lexicon.sourceLanguage,
      targetLanguage: lexicon.targetLanguage,
    });
  }

  if (!editing) {
    return (
      <Paper p="md">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
            <ThemeIcon size={40} radius="md" variant="light" color="book">
              <IconBook2 size={20} stroke={1.6} />
            </ThemeIcon>
            <Stack gap={2} style={{ minWidth: 0 }}>
              <Text fw={600} truncate>
                {lexicon.name}
              </Text>
              <Text size="sm" c="dimmed">
                {languageLabel(lexicon.sourceLanguage)} →{" "}
                {languageLabel(lexicon.targetLanguage)}
              </Text>
            </Stack>
          </Group>
          <Button
            variant="light"
            color="gray"
            size="xs"
            leftSection={<IconPencil size={14} stroke={1.6} />}
            onClick={() => {
              syncFormFromLexicon();
              setEditing(true);
            }}
          >
            Edit
          </Button>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="md">
      <Stack gap="xs">
        <form onSubmit={onSubmit}>
          <Stack gap="sm">
            <TextInput
              label="Name"
              name="name"
              required
              {...form.getInputProps("name")}
            />
            <Group grow align="flex-start">
              <Select
                label="Source language"
                name="sourceLanguage"
                required
                data={LANGUAGE_SELECT_DATA}
                allowDeselect={false}
                {...form.getInputProps("sourceLanguage")}
              />
              <Select
                label="Target language"
                name="targetLanguage"
                required
                data={LANGUAGE_SELECT_DATA}
                allowDeselect={false}
                {...form.getInputProps("targetLanguage")}
              />
            </Group>
            <Group justify="flex-end" gap="sm">
              <Button
                type="button"
                size="sm"
                variant="default"
                onClick={() => {
                  syncFormFromLexicon();
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" loading={form.submitting}>
                Save
              </Button>
            </Group>
          </Stack>
        </form>
        {error ? (
          <Alert color="red" title="Something went wrong">
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}

export function ManageLexiconsPanel() {
  const { setLexiconId } = useContext(LexiconContext)!;
  const lexiconsQuery = useLexicons();
  const lexicons = lexiconsQuery.data ?? [];
  const listError = errorMessage(
    lexiconsQuery.error,
    "Unable to load lexicons",
  );

  return (
    <Stack gap="xl">
      <CreateLexiconForm onCreated={setLexiconId} />

      <Stack
        gap="md"
        component="section"
        aria-labelledby="your-lexicons-heading"
      >
        <Title order={2} id="your-lexicons-heading">
          Your lexicons
        </Title>
        {lexiconsQuery.isPending ? <Text c="dimmed">Loading…</Text> : null}
        {!lexiconsQuery.isPending && lexicons.length === 0 ? (
          <Center py="md">
            <Text c="dimmed" ta="center" maw={360}>
              No lexicons yet. Create one above with a name and language pair to
              start collecting vocabulary.
            </Text>
          </Center>
        ) : null}
        <Stack gap="sm">
          {lexicons.map((lexicon) => (
            <EditLexiconRow key={lexicon.id} lexicon={lexicon} />
          ))}
        </Stack>
        {listError ? (
          <Alert color="red" title="Something went wrong">
            {listError}
          </Alert>
        ) : null}
      </Stack>
    </Stack>
  );
}
