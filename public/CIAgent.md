# CI Agent Branch Spec

## Branch Authority

**`dev` is the source of truth.** It contains the most recent work from the lead developer and is closest to production-ready state.

## Pre-Session Branch Check

Before working on any feature branch, run this diagnostic:

```bash
# 1. Identify divergence from dev
git log dev..BRANCH --oneline | head -20
git log BRANCH..dev --oneline | head -20

# 2. Get diff stats
git diff BRANCH...dev --stat | tail -20

# 3. Check how stale the branch is
git log -1 --format="%ar" BRANCH
git log -1 --format="%ar" dev
```

### Quick Health Summary

| Metric | Command | Red Flag |
|--------|---------|----------|
| Commits behind dev | `git rev-list --count BRANCH..dev` | >10 commits |
| Commits ahead of dev | `git rev-list --count dev..BRANCH` | N/A (expected) |
| Files diverged | `git diff BRANCH dev --stat \| tail -1` | >50 files |
| Last branch activity | `git log -1 --format="%ar" BRANCH` | >2 weeks ago |

## Sync Strategy

### Rebase onto dev at session start

```bash
git checkout BRANCH
git fetch origin
git rebase dev
# Resolve conflicts, favoring dev for:
#   - Structural/architectural changes
#   - New pages or content
#   - Config files (_config.yml, package.json, etc.)
#   - Shared CSS/JS
git push --force-with-lease origin BRANCH
```

### Conflict Resolution Priority

When conflicts arise, consider this hierarchy:

1. **dev wins by default** — It has the latest vetted work
2. **Feature branch wins only if** — The change is the explicit purpose of the branch
3. **Ask if unclear** — Don't guess on business logic or content conflicts

### Common Conflict Scenarios

| Conflict Type | Resolution |
|---------------|------------|
| New file in dev, not in branch | Keep dev's file |
| Same file edited in both | Merge carefully, preserve dev's structure |
| File deleted in dev, edited in branch | Usually delete (dev's deletion was intentional) |
| CSS/styling conflicts | Prefer dev, layer branch changes on top |
| Content/copy conflicts | Prefer dev unless branch is specifically for that content |

## Before Making Edits

When working on a stale feature branch:

1. **Merge dev first** — `git merge dev` before any new work
2. **Review the diff** — Understand what dev added that the branch lacks
3. **Don't duplicate work** — Check if dev already solved the problem
4. **Preserve dev's additions** — New pages, assets, config in dev are intentional

## Branch Lifecycle

```
main (production)
  └── dev (active development, lead dev's work)
        ├── FurryDen (secondary dev's persistent branch)
        ├── other-dev-branch (another contributor's space)
        └── short-lived-feature (temporary, merged and deleted)
```

### Persistent Developer Branches

Secondary developers maintain their own long-lived branches. These are **not deleted** after merging — they're workspaces developers return to.

When returning to a stale branch, **rebase onto dev** to pull in all recent work:

```bash
git checkout FurryDen
git fetch origin
git rebase dev
# Resolve conflicts, then force push if remote exists
git push --force-with-lease origin FurryDen
```

This replays the branch's unique commits on top of current dev, keeping history clean and the branch current.

### Rebase vs Merge

| Approach | Use When |
|----------|----------|
| `git rebase dev` | Returning to a stale branch, want clean history |
| `git merge dev` | Mid-session sync, preserving branch commit history |

Rebase is preferred for **session start** — it strongly anchors the branch to dev's current state. The branch's commits sit cleanly on top of all dev work.

## Example Pre-Session Workflow

```bash
# Starting work on FurryDen branch
git checkout FurryDen
git fetch origin

# Check divergence
echo "=== Commits on FurryDen not in dev ==="
git log dev..FurryDen --oneline

echo "=== Commits on dev not in FurryDen ==="
git log FurryDen..dev --oneline | head -10

echo "=== Files changed between branches ==="
git diff FurryDen dev --stat | tail -5

# Rebase onto dev to get current (preferred for session start)
git rebase dev

# If conflicts, resolve then continue
git rebase --continue

# Update remote branch
git push --force-with-lease origin FurryDen

# Now safe to work — branch sits on top of latest dev
```

## Red Flags

Stop and reassess if:
- Branch is >50 commits behind dev
- Branch hasn't been touched in >1 month
- Rebase conflicts affect >20 files
- Branch duplicates work already in dev

In these cases:
- **Always rebase onto dev first** — This is non-negotiable for stale branches
- **Resolve conflicts favoring dev** — Dev's changes are vetted and intentional
- **Cherry-pick if rebase is painful** — Extract only the valuable unique commits
- **Keep the branch** — It's the developer's workspace, just get it current
