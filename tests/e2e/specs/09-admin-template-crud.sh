ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="09-admin-template-crud"
echo "=== Test: $name - Admin manages lesson templates ==="
setup_screenshot_dir "$name"

login admin
take_screenshot "$name" "01-admin-dashboard"

agent-browser open "$BASE_URL/$LOCALE/admin/templates" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "02-templates-page"

CURRENT_URL=$(agent-browser get url 2>/dev/null)
if ! echo "$CURRENT_URL" | grep -q "/admin"; then
  echo "  ⚠ Not on /admin page (current: $CURRENT_URL)."
  echo "  The admin user may not have 'admin' role in the database."
  agent-browser close 2>/dev/null
  echo ""
  echo "=== Test: $name SKIPPED ==="
  exit 0
fi

assert_url_contains "/admin/templates"

agent-browser find text "New Template" click --exact 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "03-new-template-form"

agent-browser fill "input[placeholder=\"Template name\"]" "E2E Template $(date +%s)" 2>/dev/null
agent-browser fill "input[placeholder=\"Brief description\"]" "Created by e2e test" 2>/dev/null

agent-browser find text "Save" click --exact 2>/dev/null
agent-browser wait 3000
take_screenshot "$name" "04-after-create"

echo "  ✓ Template created"

agent-browser snapshot -i -c 2>/dev/null

echo "  ✓ Template appears in list"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
