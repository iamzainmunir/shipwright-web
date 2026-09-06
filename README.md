<p align="center">
  <img src="logo.png" width="96" height="96" alt="Shipwright" />
</p>

<h1 align="center">Shipwright</h1>

<p align="center"><strong>An autonomous AI software company.</strong><br/>
You file a ticket; a team of AI agents takes it from spec to a running application.</p>

<p align="center">
  <a href="https://github.com/iamzainmunir/shipwright"><strong>▶ App &amp; source code →</strong></a>
</p>

---

## What is Shipwright?

Shipwright turns a plain request — *"Build a notes app", "Fix this bug", "Add an endpoint"* —
into working, running software. A full team of role-locked AI agents (PM, architect, engineers,
QA, reviewer, DevOps) carries the work through spec, planning, parallel build, code review, QA, and
ship, and hands you a real application on disk. **You hold the gates that matter** — the team can run
end to end on its own, but it never force-pushes or approves a risky merge without you.

Every deliverable is real, runnable code — never a mock. When the team can't produce something
shippable, it **stops and asks** instead of shipping broken work.

## How it works

The run is a **decision graph**, not a straight line — each phase's verdict can send work forward,
back to the failing step, or up to the architect for a call:

```
intake → clarify → spec → plan → build → review → QA → ship
                                  ▲        │       │
                                  └── rework ◄─────┘   (QA/review send fixes to the failing part only)
                                       │
                                  CTO decision (redesign · rebuild · proceed)
```

- **Code review before QA** — the CTO reviews the code first; QA then verifies the reviewed
  build's *behaviour* as the final gate, so what ships is exactly what QA blessed.
- **Targeted rework** — when QA or review flags a problem, only the failing part rebuilds; the rest
  is untouched. Every loop is bounded, so no cycle runs forever.
- **Never ships unverified** — a deterministic gate overrides any hallucinated "looks good": QA must
  actually pass and the build must be real.

## The team

Each mission runs on a team of role-locked specialists — every agent does only its own job.

| Role | Does | Does **not** |
|---|---|---|
| **PM** | scope, spec, acceptance criteria, plan | write code or design visuals |
| **CTO** | architecture decisions + the code review | write day-to-day feature code |
| **Backend** | server APIs, data, business logic | UI / styling |
| **Frontend** | UI, components, client state | server APIs / data models |
| **QA** | verify behaviour against acceptance criteria | review code style |
| **DevOps** | merge, deploy, rollback | write product features |
| **Designer · BA · Security** | UX, requirements, threat modelling | out-of-lane work |

## Models

Assign any model to any agent, and mix and match per role:

- **Anthropic**, **OpenAI / Gemini / Groq / Mistral / DeepSeek** (OpenAI-compatible), **local Ollama**
  (free), or any OpenAI-compatible endpoint.
- **Claude Code CLI** — drive your local `claude` binary (your subscription seat) as a provider.

Per-agent bindings, failover chains, budgets, rate caps, and live token/cost metering are all built in.

## Autonomy — *when* you're in the loop

Set per mission: **manual → assisted → supervised → autonomous**. Autonomous runs the whole pipeline
unattended, but the merge / ship gate is always yours to authorize.

## Key features

- **Parallel, coherent builds** — engineers implement their slices in isolated git worktrees,
  dependency-ordered, then merged.
- **Real-app QA harness** — boots the app's own server, drives a headless browser, and checks each
  acceptance criterion by behaviour, with screenshots as evidence.
- **Built-in ticket board** — a Jira-like board that live-updates as the team works, plus an optional
  one-way Jira mirror.
- **Notifications** — email, WhatsApp, or Slack alerts on blockers, approvals, ships, and halts.
- **Integrations** — GitHub (push / PR at the ship gate, with your consent), Jira, and a real browser
  the QA agents can drive.

## Repositories

| Repo | Purpose |
|---|---|
| **[iamzainmunir/shipwright](https://github.com/iamzainmunir/shipwright)** | The product — the full application (Next.js web + FastAPI orchestrator + agent engine). |
| **iamzainmunir/shipwright-web** *(this repo)* | The public marketing website. |

## About this website

This repository is the static landing site — no build step, deployable to any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages). To preview it locally:

```bash
python3 -m http.server 4700   # then open http://localhost:4700
```

Licensed under the [MIT License](LICENSE).
