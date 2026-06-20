---
name: bluespec.specialize
description: Specialize Blue Spec in a specific security area, from a source or topic you give it. It reads the material and distills it into a focused, defense-only sub-skill, shaped exactly like the built-in ones, so `/bluespec.skills` loads it afterwards like any other. It only audits and explains — it never writes attack inputs or exploits, and it never touches your code.
argument-hint: A topic (for example `prototype pollution`), an article URL, or an exploit/payload to distill into a defense-only sub-skill
user-invocable: true
---

## User Input

```text
$ARGUMENTS
```

The User Input above is the source material. Read it before proceeding.

## What this does

You distill the given material into a new **defense-only sub-skill** under
`.bluespec/skills/<name>.md`, shaped exactly like the built-in ones
(`regex`, `javascript`, `browser`), and register it in the catalog so
`/bluespec.skills` can load it afterwards like any other.

The source can take three shapes — the outcome is always the same: a
focused defensive audit guide, never an attack tool.

- **From an article:** a URL or pasted text describing a class of
  vulnerability. Distill the defensive essence.
- **From an exploit:** a payload or attack string (for example
  `"' OR 1=1 --"`). The sub-skill is still the **defense**: what the class
  is, how to recognize vulnerable code, how to verify a control holds.
  Never reproduce the payload as a runnable attack or a copy-paste exploit.
- **From a topic:** a short phrase (for example `SSRF`,
  `prototype pollution`). Distill from your own security knowledge.

## Rules (non-negotiable)

- **Defense-only.** The sub-skill audits and explains. It never writes
  attack inputs, exploit code, or payloads meant to be run. If the source
  is an exploit, extract the defensive lesson and describe the dangerous
  shape in prose — do not emit a working attack.
- **Never touch the user's code.** This command authors a knowledge file
  and updates the catalog. It does not edit, run, or scan application code
  — that is what the audit phases (`detect`, `harden`, `verify`) and
  `bluespec.skills` do.
- **Shaped like the built-ins.** Match the structure of the existing
  `.bluespec/skills/*.md` files so the result is indistinguishable from a
  built-in sub-skill.
- **Read and report.** When you finish, summarize what you created. The
  calling phase decides what, if anything, to record.

## Outline

1. **Resolve the source and pick a name.**
   - Identify which shape the input is (article / exploit / topic) and the
     vulnerability class it concerns.
   - Choose a short, lowercase, hyphen-free `<name>` (for example `ssrf`,
     `sqli`, `prototype-pollution` → `prototypepollution`). It must not
     collide with an existing entry — check the current catalog first:
     ```bash
     node ./.bluespec/hooks/skills.mjs
     ```
   - Pick 2–5 `tags` that describe what the sub-skill covers (the words a
     future caller would use to reach it, for example `SSRF`,
     `Server-Side Request Forgery`).
   - If the input is empty or you cannot determine a vulnerability class,
     say so and stop. Never invent a sub-skill from nothing.

2. **Distill the material into the sub-skill file.** Write
   `.bluespec/skills/<name>.md` following the built-in shape:
   - A title line: `# <Human-readable name of the vulnerability class>`.
   - The loader hint: `> It is loaded by \`/bluespec.skills <name>\`.`
   - A one-paragraph plain-language definition of the class.
   - A `## Rules` section stating it audits and explains, never rewrites
     the user's code and never produces an attack input.
   - A `## How to check` section: concrete, language-agnostic steps to
     recognize vulnerable code and to verify a control holds — the
     dangerous shape described in prose, safe patterns shown, unsafe ones
     described (not handed over as runnable exploits).
   - Keep it focused and short, like the existing files.

3. **Register it in the catalog.** The catalog is the `SKILLS_CATALOG`
   array inside `./.bluespec/hooks/skills.mjs`. Add an entry
   `{ name: "<name>", tags: ["<tag>", ...] }` to that array, matching the
   existing formatting. Then confirm it lists:
   ```bash
   node ./.bluespec/hooks/skills.mjs
   ```
   The new name must appear with its tags.

4. **Record it in the manifest.** Add `.bluespec/skills/<name>.md` to the
   `files` array in `.bluespec/manifest.json` if it tracks sub-skills, so
   the new file is part of the project's Blue Spec install.

5. **Summarize.** Report the name, the tags, the vulnerability class it
   covers, and that it is loadable via `/bluespec.skills <name>`. Confirm
   it contains no attack inputs and touched no application code.
