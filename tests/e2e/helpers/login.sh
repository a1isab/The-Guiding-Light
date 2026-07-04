login() {
  local role="$1"
  local creds="${CREDS[$role]}"
  local email="${creds%%:*}"
  local password="${creds##*:}"

  echo "  [login] Opening $BASE_URL/$LOCALE/auth/login"
  agent-browser open "$BASE_URL/$LOCALE/auth/login" 2>/dev/null
  agent-browser wait --load domcontentloaded 2>/dev/null
  agent-browser wait 1000

  agent-browser fill "input#email" "$email" 2>/dev/null
  agent-browser fill "input#password" "$password" 2>/dev/null

  agent-browser click "button[type=\"submit\"]" 2>/dev/null

  case $role in
    admin)
      agent-browser wait --url "**/admin" 25000 2>/dev/null
      echo "  [login] Admin logged in, redirected to /admin"
      ;;
    teacher)
      agent-browser wait --url "**/teacher" 25000 2>/dev/null
      echo "  [login] Teacher logged in, redirected to /teacher"
      ;;
    student)
      agent-browser wait --url "**/dashboard" 25000 2>/dev/null
      echo "  [login] Student logged in, redirected to /dashboard"
      ;;
  esac

  agent-browser wait 1000
}

setup_screenshot_dir() {
  local name="$1"
  mkdir -p "$SCREENSHOT_DIR/$name"
}

take_screenshot() {
  local name="$1"
  local step="$2"
  local filename="$SCREENSHOT_DIR/$name/${step}.png"
  agent-browser screenshot "$filename" 2>/dev/null
  echo "  [screenshot] Saved $filename"
}
