# repo-roaster

> Automated technical debt inspection and architectural triage for public Git repositories.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google GenAI](https://img.shields.io/badge/Google_GenAI-Gemini_3.6-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**repo-roaster** evaluates the structural hygiene of public GitHub codebases without cloning multi-gigabyte trees into serverless runtimes. It queries the GitHub REST Trees API recursively, applies deterministic JSON schema constraints, and renders clinical post-mortems via Gemini.

---

## Architectural Principles

- **Zero-Clone Ingestion**: Scans default branch trees recursively via the GitHub REST API under a strict network budget.
- **Strict Response Schemas**: Utilizes Google GenAI typed contracts (`Type.OBJECT`, `Type.ARRAY`) to prevent malformed text generation.
- **Rate-Guarded Core**: Sliding-window IP rate limiting protects quota limits against automated scrapers.
- **Ephemeral Processing**: Operates without a persistent database; zero user code is retained.

---

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
