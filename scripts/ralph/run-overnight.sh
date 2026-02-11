#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

# Ralph requires bun in PATH.
export PATH="$HOME/.bun/bin:$PATH"

MAX_ITERATIONS="${1:-${RALPH_MAX_ITERATIONS:-1000}}"
AGENT="${RALPH_AGENT:-opencode}"
MODEL="${RALPH_MODEL:-}"
PROMPT_FILE="${SCRIPT_DIR}/overnight-phaser.prompt.md"
TASKS_FILE="${ROOT_DIR}/.ralph/ralph-tasks.md"
TASK_PROMISE="${RALPH_TASK_PROMISE:-NEXT_PR_DONE}"
COMPLETION_PROMISE="${RALPH_COMPLETION_PROMISE:-ALL_PR_TASKS_COMPLETE}"

if [ ! -f "${PROMPT_FILE}" ]; then
  echo "Prompt file not found: ${PROMPT_FILE}" >&2
  exit 1
fi

if [ ! -f "${TASKS_FILE}" ]; then
  echo "Tasks file not found: ${TASKS_FILE}" >&2
  exit 1
fi

if ! grep -Eq '^- \[( |/)\] ' "${TASKS_FILE}"; then
  echo "All Ralph tasks are already complete in ${TASKS_FILE}. Nothing to run."
  exit 0
fi

echo "Starting overnight Ralph loop"
echo "- Agent: ${AGENT}"
echo "- Max iterations: ${MAX_ITERATIONS}"
echo "- Prompt file: ${PROMPT_FILE}"
echo "- Task promise: ${TASK_PROMISE}"
echo "- Completion promise: ${COMPLETION_PROMISE}"

if [ -n "${MODEL}" ]; then
  npx ralph \
    --agent "${AGENT}" \
    --model "${MODEL}" \
    --prompt-file "${PROMPT_FILE}" \
    --tasks \
    --task-promise "${TASK_PROMISE}" \
    --completion-promise "${COMPLETION_PROMISE}" \
    --max-iterations "${MAX_ITERATIONS}" \
    --allow-all
else
  npx ralph \
    --agent "${AGENT}" \
    --prompt-file "${PROMPT_FILE}" \
    --tasks \
    --task-promise "${TASK_PROMISE}" \
    --completion-promise "${COMPLETION_PROMISE}" \
    --max-iterations "${MAX_ITERATIONS}" \
    --allow-all
fi
