ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config.sh"
source "$ROOT_DIR/helpers/login.sh"

name="01-login-all-roles"
echo "=== Test: $name - Login all three roles ==="
setup_screenshot_dir "$name"

for role in student teacher admin; do
  echo ""
  echo "--- Logging in as $role ---"
  login "$role"
  take_screenshot "$name" "after-login-$role"

  case $role in
    student) assert_url_contains "/dashboard" ;;
    teacher) assert_url_contains "/teacher" ;;
    admin)   assert_url_contains "/admin" ;;
  esac

  agent-browser close 2>/dev/null
done

echo ""
echo "=== Test: $name PASSED ==="
