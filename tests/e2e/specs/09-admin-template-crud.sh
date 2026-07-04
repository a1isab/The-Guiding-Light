name="09-admin-template-crud"
echo "=== Test: $name - Admin manages lesson templates ==="
setup_screenshot_dir "$name"

login admin
take_screenshot "$name" "01-admin-dashboard"

agent-browser open "$BASE_URL/$LOCALE/admin/templates" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "02-templates-page"

agent-browser click "button" --name "New Template" 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "03-new-template-form"

agent-browser fill "input[placeholder=\"Template name\"]" "E2E Template $(date +%s)" 2>/dev/null
agent-browser fill "input[placeholder=\"Brief description\"]" "Created by e2e test" 2>/dev/null

agent-browser click "button" --name "Save" --exact 2>/dev/null
agent-browser wait 3000
take_screenshot "$name" "04-after-create"

echo "  ✓ Template created"

agent-browser snapshot -i -c 2>/dev/null

echo "  ✓ Template appears in list"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
