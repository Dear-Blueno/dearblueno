#!/usr/bin/env bash
set -euo pipefail
: "${VERCEL_ORG_ID:?Configure VERCEL_ORG_ID}"
: "${VERCEL_API_PROJECT_ID:?Configure VERCEL_API_PROJECT_ID}"
: "${VERCEL_CLIENT_PROJECT_ID:?Configure VERCEL_CLIENT_PROJECT_ID}"
: "${DEPLOY_TARGET:?Set production or preview}"
[[ "$DEPLOY_TARGET" == production || "$DEPLOY_TARGET" == preview ]]
repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
# Install the pinned CLI in CI; locally use the authenticated global CLI.
command -v vercel >/dev/null
credentials=()
if [[ -n "${VERCEL_TOKEN:-}" ]]; then credentials=(--token="$VERCEL_TOKEN");
elif [[ "${CI:-}" == true ]]; then echo 'VERCEL_TOKEN is required in CI' >&2; exit 1; fi
production_args=()
if [[ "$DEPLOY_TARGET" == production ]]; then production_args=(--prod); fi
urls=()
for component in server client; do
  if [[ "$component" == server ]]; then export VERCEL_PROJECT_ID="$VERCEL_API_PROJECT_ID";
  else export VERCEL_PROJECT_ID="$VERCEL_CLIENT_PROJECT_ID"; fi
  cd "$repo_dir/$component"
  vercel pull --yes --environment="$DEPLOY_TARGET" "${credentials[@]}"
  vercel build "${production_args[@]}" "${credentials[@]}"
  deployment_json="$(vercel deploy --prebuilt "${production_args[@]}" --skip-domain --json "${credentials[@]}")"
  deployment_url="$(node -e 'let data="";process.stdin.on("data",chunk=>data+=chunk).on("end",()=>{const result=JSON.parse(data);if(result.status!=="ok"||result.deployment?.readyState!=="READY")process.exit(1);console.log(result.deployment.url)})' <<< "$deployment_json")"
  urls+=("$deployment_url")
done
# Both builds and uploads must succeed before changing production aliases.
if [[ "$DEPLOY_TARGET" == production ]]; then
  for index in 0 1; do
    if [[ "$index" == 0 ]]; then export VERCEL_PROJECT_ID="$VERCEL_API_PROJECT_ID"; cd "$repo_dir/server";
    else export VERCEL_PROJECT_ID="$VERCEL_CLIENT_PROJECT_ID"; cd "$repo_dir/client"; fi
    vercel promote "${urls[$index]}" --yes "${credentials[@]}"
  done
else
  printf '%s\n' "${urls[@]}"
fi
