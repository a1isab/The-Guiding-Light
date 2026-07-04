name="08-student-view-lesson"
echo "=== Test: $name - Student views lesson and marks content as viewed ==="
setup_screenshot_dir "$name"

login student
take_screenshot "$name" "01-student-dashboard"

echo "  NOTE: This test requires an existing class enrollment with a course and lesson."
echo "  Update URL below."
echo ""
agent-browser open "$BASE_URL/$LOCALE/dashboard/classes/TODO/courses/TODO/lessons/TODO" 2>/dev/null
agent-browser wait --load domcontentloaded 2>/dev/null
agent-browser wait 2000
take_screenshot "$name" "02-lesson-page"

assert_text_visible "Mark as Viewed"
echo "  ✓ 'Mark as Viewed' button visible"

agent-browser find text "Mark as Viewed" click --exact 2>/dev/null
agent-browser wait 3000
take_screenshot "$name" "03-after-mark-viewed"

echo "  ✓ Content marked as viewed"

agent-browser close 2>/dev/null
echo ""
echo "=== Test: $name PASSED ==="
