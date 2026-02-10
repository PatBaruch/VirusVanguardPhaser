#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

# Ralph requires bun in PATH.
export PATH="$HOME/.bun/bin:$PATH"

MAX_ITERATIONS="${1:-40}"
AGENT="${RALPH_AGENT:-opencode}"
MODEL="${RALPH_MODEL:-}"
PROMPT_FILE="${SCRIPT_DIR}/overnight-phaser.prompt.md"

if [ ! -f "${PROMPT_FILE}" ]; then
  echo "Prompt file not found: ${PROMPT_FILE}" >&2
  exit 1
fi

echo "Starting overnight Ralph loop"
echo "- Agent: ${AGENT}"
echo "- Max iterations: ${MAX_ITERATIONS}"
echo "- Prompt file: ${PROMPT_FILE}"

if [ -n "${MODEL}" ]; then
  npx ralph \
    --agent "${AGENT}" \
    --model "${MODEL}" \
    --prompt-file "${PROMPT_FILE}" \
    --tasks \
    --task-promise "READY_FOR_NEXT_TASK" \
    --completion-promise "COMPLETE" \
    --max-iterations "${MAX_ITERATIONS}" \
    --allow-all
else
  npx ralph \
    --agent "${AGENT}" \
    --prompt-file "${PROMPT_FILE}" \
    --tasks \
    --task-promise "READY_FOR_NEXT_TASK" \
    --completion-promise "COMPLETE" \
    --max-iterations "${MAX_ITERATIONS}" \
    --allow-all
fi
