import { useContext } from "react";
import {
  Alert,
  Button,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconList, IconPlus } from "@tabler/icons-react";
import { useCreateLexiconEntries } from "../../api/lexicon-entry";
import { LexiconContext } from "../../contexts/LexiconContext";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

function parseBulkValues(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AddLexiconEntriesForm() {
  const { lexicon } = useContext(LexiconContext)!;
  const createEntries = useCreateLexiconEntries(lexicon?.id);

  const individualForm = useForm({
    initialValues: {
      value: "",
    },
    validate: {
      value: (value) => (value.trim().length === 0 ? "Enter a value" : null),
    },
  });

  const bulkForm = useForm({
    initialValues: {
      values: "",
    },
    validate: {
      values: (value) =>
        parseBulkValues(value).length === 0 ? "Enter at least one value" : null,
    },
  });

  const error = errorMessage(
    createEntries.error,
    "Unable to create lexicon entries",
  );
  const bulkCount = parseBulkValues(bulkForm.values.values).length;

  const onCreateIndividual = individualForm.onSubmit(async (values) => {
    if (!lexicon) {
      return;
    }

    await createEntries.mutateAsync([values.value.trim()]);
    individualForm.reset();
  });

  const onCreateBulk = bulkForm.onSubmit(async (values) => {
    if (!lexicon) {
      return;
    }

    await createEntries.mutateAsync(parseBulkValues(values.values));
    bulkForm.reset();
  });

  if (!lexicon) {
    return null;
  }

  return (
    <Paper p="lg" component="section" aria-labelledby="add-entry-heading">
      <Stack gap="md">
        <Title order={2} id="add-entry-heading">
          Add entries
        </Title>

        <Tabs defaultValue="individual">
          <Tabs.List>
            <Tabs.Tab
              value="individual"
              leftSection={<IconPlus size={14} stroke={1.6} />}
            >
              Individual
            </Tabs.Tab>
            <Tabs.Tab
              value="bulk"
              leftSection={<IconList size={14} stroke={1.6} />}
            >
              Bulk
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="individual" pt="md">
            <form onSubmit={onCreateIndividual}>
              <Group align="flex-end" gap="sm" wrap="nowrap">
                <TextInput
                  label="Value"
                  name="value"
                  required
                  flex={1}
                  placeholder="e.g. 你好"
                  {...individualForm.getInputProps("value")}
                />
                <Button
                  type="submit"
                  loading={individualForm.submitting}
                  disabled={individualForm.values.value.trim().length === 0}
                >
                  Add
                </Button>
              </Group>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="bulk" pt="md">
            <form onSubmit={onCreateBulk}>
              <Stack gap="sm">
                <Textarea
                  label="Values"
                  name="values"
                  required
                  minRows={6}
                  autosize
                  maxRows={16}
                  placeholder={"你好\n谢谢\n再见"}
                  {...bulkForm.getInputProps("values")}
                />
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">
                    {bulkCount > 0
                      ? `${bulkCount} ${bulkCount === 1 ? "entry" : "entries"} ready`
                      : null}
                  </Text>
                  <Button
                    type="submit"
                    loading={bulkForm.submitting}
                    disabled={bulkCount === 0}
                  >
                    Add entries
                  </Button>
                </Group>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>

        {error ? (
          <Alert color="red" title="Something went wrong">
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}
