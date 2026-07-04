name="10-admin-role-guard"
echo "=== Test: $name - Non-admin cannot access admin area ==="
setup_screenshot_dir "$name"

login student
take_screenshot "$name" "01-student-dashboard"

agent-browser open "$BASE_URL/$LOCALE/admin" 2>/dev/null
agent-browser wait 5000

take_screenshot "$name" "02-after-redirect"

assert_url_contains "/dashboard"
echo "  ✓ Student redirected to /dashboard (not /admin)"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
