import { Stack } from "@mantine/core";
import { PageHeader } from "../components/atoms/PageHeader";
import { GenerateStoryPanel } from "../components/organisms/GenerateStoryPanel";
import { TaggedText } from "@lexicon/shared/model";
import TaggedTextDisplay from "../components/molecules/TaggedTextDisplay";

const sample: TaggedText = {
  text: "我喜欢学中文！",
  segments: [
    {
      type: "lexical",
      value: "我",
      lexicalEntryId: "9edf7f89-aaa1-4a88-b861-c07d3767bed5",
    },
    { type: "lexical", value: "喜欢", lexicalEntryId: "lex-xihuan" },
    { type: "lexical", value: "学", lexicalEntryId: "lex-xue" },
    { type: "lexical", value: "中文", lexicalEntryId: "lex-zhongwen" },
    { type: "text", value: "！" },
  ],
};

export function StoryPage() {
  return (
    <Stack gap="xl">
      <PageHeader title="Story" />
      <GenerateStoryPanel />
      <TaggedTextDisplay text={sample} />
    </Stack>
  );
}
