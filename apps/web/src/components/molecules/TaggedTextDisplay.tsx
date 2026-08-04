import { HoverCard, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import type { TaggedText } from "@lexicon/shared/model";
import { LexiconEntryCardLoader } from "./LexiconEntryCardLoader";

interface TaggedTextDisplayProps {
  text: TaggedText;
}

function LexicalSegment({
  value,
  entryId,
}: {
  value: string;
  entryId?: string;
}) {
  if (!entryId) {
    return <Text span>{value}</Text>;
  }

  return (
    <HoverCard
      width={320}
      shadow="md"
      openDelay={200}
      closeDelay={100}
      withinPortal
      keepMounted={false}
    >
      <HoverCard.Target>
        <Text
          span
          component={Link}
          to={`/lexicon/entries/${entryId}`}
          c="book"
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationStyle: "dotted",
            textUnderlineOffset: 3,
          }}
        >
          {value}
        </Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <LexiconEntryCardLoader entryId={entryId} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

const TaggedTextDisplay: React.FC<TaggedTextDisplayProps> = ({ text }) => {
  return (
    <Text component="div" lh={1.7} size="lg" style={{ whiteSpace: "pre-wrap" }}>
      {text.segments.map((segment, i) => {
        if (segment.type === "text") {
          return (
            <Text span key={i}>
              {segment.value}
            </Text>
          );
        }

        return (
          <LexicalSegment
            key={i}
            value={segment.value}
            entryId={segment.lexicalEntryId}
          />
        );
      })}
    </Text>
  );
};

export default TaggedTextDisplay;
