import { useContext, useState } from "react";
import {
  Alert,
  Anchor,
  Button,
  Group,
  List,
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
import { Link } from "react-router-dom";
import type { DuplicateLexiconEntry } from "@lexicon/shared/service";
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

function DuplicateEntriesAlert({
  duplicates,
}: {
  duplicates: DuplicateLexiconEntry[];
}) {
  const count = duplicates.length;

  return (
    <Alert color="yellow" title="Duplicates skipped">
      <Stack gap="xs">
        <Text size="sm">
          {count === 1
            ? "1 value already exists and was not added:"
            : `${count} values already exist and were not added:`}
        </Text>
        <List size="sm" spacing={4}>
          {duplicates.map((duplicate) => (
            <List.Item key={duplicate.existing.id}>
              <Anchor
                component={Link}
                to={`/lexicon/entries/${duplicate.existing.id}`}
              >
                {duplicate.value}
              </Anchor>
            </List.Item>
          ))}
        </List>
      </Stack>
    </Alert>
  );
}

export function AddLexiconEntriesForm() {
  const { lexicon } = useContext(LexiconContext)!;
  const createEntries = useCreateLexiconEntries(lexicon?.id);
  const [duplicates, setDuplicates] = useState<DuplicateLexiconEntry[]>([]);

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

    const result = await createEntries.mutateAsync([values.value.trim()]);
    setDuplicates(result.duplicates);
    if (result.created.length > 0) {
      individualForm.reset();
    }
  });

  const onCreateBulk = bulkForm.onSubmit(async (values) => {
    if (!lexicon) {
      return;
    }

    const result = await createEntries.mutateAsync(
      parseBulkValues(values.values),
    );
    setDuplicates(result.duplicates);
    if (result.created.length > 0 || result.duplicates.length > 0) {
      bulkForm.reset();
    }
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

        {duplicates.length > 0 ? (
          <DuplicateEntriesAlert duplicates={duplicates} />
        ) : null}

        {error ? (
          <Alert color="red" title="Something went wrong">
            {error}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}
