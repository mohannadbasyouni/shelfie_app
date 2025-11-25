# Repository Agent Guidelines

This repository uses Codex automation. Follow all rules in this file for every change within the repo.

## State Management
- Use **Zustand** for application-wide state. Do not introduce alternative global state libraries.
- Prefer slice-based stores with typed selectors and avoid prop drilling when a store already exists.
- Keep store initialization in `app` or `lib` scope; do not re-create stores inside components.

## Appwrite Usage
- Reuse the shared Appwrite client instance; do not instantiate new clients per component.
- Configure Appwrite environment values via existing config utilities—no hardcoded endpoints or project IDs.
- Use Appwrite permissions explicitly (e.g., `role:member`, user-specific documents). Do not rely on defaults.
- Realtime subscriptions must use the shared subscription helper; avoid ad-hoc `client.subscribe` calls.
- When creating or updating data, set permissions alongside the operation rather than a follow-up mutation.

## Realtime Subscription Guard
- Maintain a **single subscription per authenticated user** for each channel/topic.
- Implement a guard that checks for an existing subscription before creating a new one; reuse the existing listener when possible.
- Ensure cleanup on logout or user switch to prevent orphaned subscriptions.

## Pull Request Conventions
- Branch names: `feature/<short-description>`, `bugfix/<short-description>`, or `chore/<short-description>` using kebab-case.
- PRs must include:
  - A concise summary of changes.
  - Testing instructions with command outputs when available.
  - A brief diff review or notes calling out risky areas and decisions.

## Testing Requirements
- Run unit tests plus mocked Appwrite tests for affected areas; document commands and results.
- Include UI/regression checks relevant to modified components. Prefer automated UI tests; note any manual steps performed.
- If tests are skipped due to environment limits, explain why and what to run locally.

## Behavioral Rules for Codex
- Follow system/user instructions first, then this file. Do not merge or deploy.
- Keep changes minimal and intentional—avoid unrelated refactors.
- Ask for clarification when requirements are ambiguous; when uncertain, document assumptions in the PR description.
- Do not add error-swallowing `try/catch` around imports; handle errors at call sites.

## Clarification Protocol
- If a requirement is unclear, pause coding and request details from the user.
- When making assumptions to proceed, state them explicitly in the PR summary and comments where relevant.
