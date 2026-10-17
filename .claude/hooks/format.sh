#!/bin/sh
# Prettier sorts Tailwind classes through prettier-plugin-tailwindcss, so formatting on write keeps class order stable.
f=$(jq -r '.tool_input.file_path // empty')
case "$f" in
  "$CLAUDE_PROJECT_DIR"/*) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR" && npx --no-install prettier --write --ignore-unknown --log-level warn "$f" >&2
exit 0
