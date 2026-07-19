import {
  chatUsageMetadataPrefix,
  type ChatUsageMetadata,
} from "./usage-metadata";

type ReadChatTextStreamHandlers = {
  onText: (text: string) => void;
  onUsage: (usage: ChatUsageMetadata) => void;
};

export const readChatTextStream = async (
  stream: ReadableStream<Uint8Array>,
  { onText, onUsage }: ReadChatTextStreamHandlers,
) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let pendingText = "";
  let metadataText = "";
  let isReadingMetadata = false;

  const processText = (text: string) => {
    if (isReadingMetadata) {
      metadataText += text;
      return;
    }

    pendingText += text;

    const metadataIndex = pendingText.indexOf(chatUsageMetadataPrefix);

    if (metadataIndex >= 0) {
      onText(pendingText.slice(0, metadataIndex));
      metadataText += pendingText.slice(
        metadataIndex + chatUsageMetadataPrefix.length,
      );
      pendingText = "";
      isReadingMetadata = true;
      return;
    }

    const safeLength = pendingText.length - chatUsageMetadataPrefix.length + 1;

    if (safeLength > 0) {
      onText(pendingText.slice(0, safeLength));
      pendingText = pendingText.slice(safeLength);
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    processText(decoder.decode(value, { stream: true }));
  }

  const remainingText = decoder.decode();

  if (remainingText) {
    processText(remainingText);
  }

  if (!isReadingMetadata) {
    onText(pendingText);
  }

  if (metadataText) {
    onUsage(JSON.parse(metadataText) as ChatUsageMetadata);
  }
};
