This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI Provider Configuration

The chat provider is selected server-side with `AI_PROVIDER`. Only the provider
modules under `lib/ai/providers/` know about API keys, default models, and
SDK-specific setup.

Gemini is the default:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=...
```

Switch providers by changing `AI_PROVIDER`:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=...
```

Supported providers:

- `gemini` uses `@ai-sdk/google`, `GEMINI_API_KEY`, and optional `GEMINI_MODEL`.
- `openai` uses `@ai-sdk/openai`, `OPENAI_API_KEY`, and optional `OPENAI_MODEL`.
- `anthropic` uses `@ai-sdk/anthropic`, `ANTHROPIC_API_KEY`, and optional `ANTHROPIC_MODEL`.
- `groq` uses `@ai-sdk/groq`, `GROQ_API_KEY`, and optional `GROQ_MODEL`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
