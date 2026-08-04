import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Select,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  LANGUAGE_OPTIONS,
  type Definition,
  type LexiconEntry,
  type LexiconEntryStatus,
  type LexiconEntryType,
  type LexiconEntryVariant,
} from "@lexicon/shared/model";
import { useUpdateLexiconEntry } from "../../api/lexicon-entry";

const LANGUAGE_SELECT_DATA = LANGUAGE_OPTIONS.map((option) => ({
  value: option.code,
  label: option.label,
}));

const TYPE_OPTIONS: { value: LexiconEntryType; label: string }[] = [
  { value: "morpheme", label: "Morpheme" },
  { value: "lexeme", label: "Lexeme" },
  { value: "phrase", label: "Phrase" },
];

const STATUS_OPTIONS: { value: LexiconEntryStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

type EditLexiconEntryFormValues = {
  value: string;
  pronunciation: string;
  language: string;
  type: LexiconEntryType;
  status: LexiconEntryStatus;
  definitions: Definition[];
  variants: LexiconEntryVariant[];
  tags: string[];
};

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

function formValuesFromEntry(entry: LexiconEntry): EditLexiconEntryFormValues {
  return {
    value: entry.value,
    pronunciation: entry.pronunciation,
    language: entry.language,
    type: entry.type,
    status: entry.status,
    definitions: entry.definitions.map((definition) => ({ ...definition })),
    variants: entry.variants.map((variant) => ({ ...variant })),
    tags: [...entry.tags],
  };
}

function emptyDefinition(): Definition {
  return { definition: "", language: "" };
}

function emptyVariant(): LexiconEntryVariant {
  return { value: "", pronunciation: "", description: "" };
}

export type EditLexiconEntryFormProps = {
  entry: LexiconEntry;
  onCancel: () => void;
  onSaved?: () => void;
};

export function EditLexiconEntryForm({
  entry,
  onCancel,
  onSaved,
}: EditLexiconEntryFormProps) {
  const updateEntry = useUpdateLexiconEntry();
  const form = useForm<EditLexiconEntryFormValues>({
    initialValues: formValuesFromEntry(entry),
    validate: {
      value: (value) => (value.trim().length === 0 ? "Enter a value" : null),
      type: (value) =>
        TYPE_OPTIONS.some((option) => option.value === value)
          ? null
          : "Select a type",
      status: (value) =>
        STATUS_OPTIONS.some((option) => option.value === value)
          ? null
          : "Select a status",
    },
  });

  const error = errorMessage(updateEntry.error, "Unable to update entry");

  const onSubmit = form.onSubmit(async (values) => {
    const updated: LexiconEntry = {
      id: entry.id,
      lexiconId: entry.lexiconId,
      type: values.type,
      status: values.status,
      value: values.value.trim(),
      pronunciation: values.pronunciation.trim(),
      language: values.language.trim(),
      definitions: values.definitions
        .map((definition) => ({
          definition: definition.definition.trim(),
          language: definition.language.trim(),
        }))
        .filter((definition) => definition.definition.length > 0),
      variants: values.variants
        .map((variant) => ({
          value: variant.value.trim(),
          pronunciation: variant.pronunciation.trim(),
          description: variant.description.trim(),
        }))
        .filter((variant) => variant.value.length > 0),
      tags: values.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    await updateEntry.mutateAsync(updated);
    onSaved?.();
  });

  return (
    <Stack gap="md">
      <Title order={2}>Edit entry</Title>
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Value"
            name="value"
            required
            {...form.getInputProps("value")}
          />
          <TextInput
            label="Pronunciation"
            name="pronunciation"
            {...form.getInputProps("pronunciation")}
          />
          <Group grow align="flex-start">
            <Select
              label="Type"
              name="type"
              required
              data={TYPE_OPTIONS}
              allowDeselect={false}
              {...form.getInputProps("type")}
            />
            <Select
              label="Status"
              name="status"
              required
              data={STATUS_OPTIONS}
              allowDeselect={false}
              {...form.getInputProps("status")}
            />
            <Select
              label="Language"
              name="language"
              data={LANGUAGE_SELECT_DATA}
              clearable
              searchable
              {...form.getInputProps("language")}
            />
          </Group>

          <TagsInput
            label="Tags"
            name="tags"
            placeholder="Add tag"
            {...form.getInputProps("tags")}
          />

          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={600}>
                Definitions
              </Text>
              <Button
                type="button"
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} stroke={1.6} />}
                onClick={() =>
                  form.insertListItem("definitions", emptyDefinition())
                }
              >
                Add
              </Button>
            </Group>
            {form.values.definitions.length === 0 ? (
              <Text size="sm" c="dimmed">
                No definitions yet.
              </Text>
            ) : null}
            {form.values.definitions.map((_, index) => (
              <Group key={index} align="flex-start" wrap="nowrap" gap="sm">
                <Select
                  aria-label={`Definition ${index + 1} language`}
                  data={LANGUAGE_SELECT_DATA}
                  clearable
                  searchable
                  w={140}
                  {...form.getInputProps(`definitions.${index}.language`)}
                />
                <Textarea
                  aria-label={`Definition ${index + 1}`}
                  flex={1}
                  autosize
                  minRows={2}
                  {...form.getInputProps(`definitions.${index}.definition`)}
                />
                <ActionIcon
                  type="button"
                  variant="subtle"
                  color="red"
                  mt={4}
                  aria-label={`Remove definition ${index + 1}`}
                  onClick={() => form.removeListItem("definitions", index)}
                >
                  <IconTrash size={16} stroke={1.6} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>

          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={600}>
                Variants
              </Text>
              <Button
                type="button"
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} stroke={1.6} />}
                onClick={() => form.insertListItem("variants", emptyVariant())}
              >
                Add
              </Button>
            </Group>
            {form.values.variants.length === 0 ? (
              <Text size="sm" c="dimmed">
                No variants yet.
              </Text>
            ) : null}
            {form.values.variants.map((_, index) => (
              <Group key={index} align="flex-start" wrap="nowrap" gap="sm">
                <Stack gap="xs" flex={1}>
                  <Group grow align="flex-start">
                    <TextInput
                      aria-label={`Variant ${index + 1} value`}
                      placeholder="Value"
                      {...form.getInputProps(`variants.${index}.value`)}
                    />
                    <TextInput
                      aria-label={`Variant ${index + 1} pronunciation`}
                      placeholder="Pronunciation"
                      {...form.getInputProps(`variants.${index}.pronunciation`)}
                    />
                  </Group>
                  <TextInput
                    aria-label={`Variant ${index + 1} description`}
                    placeholder="Description"
                    {...form.getInputProps(`variants.${index}.description`)}
                  />
                </Stack>
                <ActionIcon
                  type="button"
                  variant="subtle"
                  color="red"
                  mt={4}
                  aria-label={`Remove variant ${index + 1}`}
                  onClick={() => form.removeListItem("variants", index)}
                >
                  <IconTrash size={16} stroke={1.6} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>

          <Group justify="flex-end" gap="sm">
            <Button
              type="button"
              variant="default"
              onClick={onCancel}
              disabled={form.submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={form.submitting}>
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
  );
}
