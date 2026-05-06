# HoloDesk Project Configuration

## Project Overview

AI-powered SaaS platform with modular architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS |
| **Frontend** | React |
| **Dashboard** | React |
| **AI Config** | OpenCode (`.opencode/`) |

## Project Structure

```
HoloDesk/
├── .opencode/              # OpenCode configuration (submodule)
├── .opencode-project/      # Project documentation
│   ├── docs/               # Technical docs
│   ├── memory/             # Context & decisions
│   ├── plans/              # Implementation tracking
│   ├── prd/                # Product requirements
│   └── secrets/            # Credentials (gitignored)
├── backend/                # NestJS API
├── frontend/               # React web app
├── dashboard/              # React admin dashboard
└── .gitmodules             # Submodule config
```

## Quick Commands

```bash
# Initialize submodules
git submodule update --init --recursive

# Pull latest opencode updates
cd .opencode && git pull origin main
```

## Custom Skills

| Skill | Command | Description |
|-------|---------|-------------|
| backend-dev-guidelines | Auto-triggered | NestJS patterns |
| frontend-dev-guidelines | Auto-triggered | React patterns |

## Getting Started

1. Clone repository
2. Run `git submodule update --init --recursive`
3. Review `.opencode-project/docs/PROJECT_KNOWLEDGE.md`
4. Start development
