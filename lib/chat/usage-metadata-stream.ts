import {
  chatUsageMetadataPrefix,
  type ChatUsageMetadata,
} from "./usage-metadata";

export const appendChatUsageMetadata = ({
  stream,
  usage,
}: {
  stream: ReadableStream<string>;
  usage: Promise<ChatUsageMetadata>;
}) =>
  new ReadableStream<string>({
    async start(controller) {
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          controller.enqueue(value);
        }

        controller.enqueue(
          `${chatUsageMetadataPrefix}${JSON.stringify(await usage)}`,
        );
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
