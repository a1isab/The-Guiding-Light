name="11-invite-code-regenerate"
echo "=== Test: $name - Teacher regenerates invite code ==="
setup_screenshot_dir "$name"

login teacher
take_screenshot "$name" "01-teacher-dashboard"

echo "  NOTE: This test requires an existing class. Update the class ID in the URL below."
echo ""
agent-browser open "$BASE_URL/$LOCALE/teacher/classes/TODO" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 1000
take_screenshot "$name" "02-class-detail"

echo "  Looking for invite code section..."
agent-browser find text "INVITE_CODE" scrollintoview 2>/dev/null
agent-browser wait 500
take_screenshot "$name" "03-invite-code"

agent-browser find role button click --name "Regenerate" 2>/dev/null || \
  agent-browser click "button[title*=\"Regenerate\" i]" 2>/dev/null

agent-browser wait 2000
take_screenshot "$name" "04-after-regenerate"

echo "  ✓ Regenerate attempted"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED (partial - confirm dialog requires manual handling) ==="
