import * as fs from "fs";
import * as path from "path";

// Using google-translate-api package (scrapes Google Translate, no API key needed)
import translate from "@iamtraction/google-translate";

const SOURCE = "en";
const TARGETS = ["ar", "ur", "fr"];

interface MessageNode {
  [key: string]: string | MessageNode;
}

function flatten(obj: MessageNode, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const k = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[k] = value;
    } else {
      Object.assign(result, flatten(value, k));
    }
  }
  return result;
}

function unflatten(map: Record<string, string>): MessageNode {
  const root: MessageNode = {};
  for (const [key, value] of Object.entries(map)) {
    const parts = key.split(".");
    let current = root;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as MessageNode;
    }
    current[parts[parts.length - 1]] = value;
  }
  return root;
}

async function translateText(text: string, target: string): Promise<string> {
  if (!text.trim()) return text;
  // Skip placeholders like {name}, {count}
  if (/^\{[\w]+\}$/.test(text.trim())) return text;
  // Skip non-alphabetic strings
  if (!/[a-zA-Z]/.test(text)) return text;

  try {
    const result = await translate(text, { from: SOURCE, to: target });
    return result.text;
  } catch (err) {
    console.warn(`  ⚠️  Failed to translate "${text.slice(0, 40)}..." → ${target}: ${err}`);
    return text; // fallback to English
  }
}

async function translateAll() {
  const enPath = path.resolve("messages/en.json");
  const enContent = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const flat = flatten(enContent);
  const keys = Object.keys(flat);

  for (const target of TARGETS) {
    console.log(`\n🌐 Translating to ${target}...`);
    const translated: Record<string, string> = {};

    // Translate in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (key) => {
          const t = await translateText(flat[key], target);
          return { key, text: t };
        })
      );
      for (const r of results) {
        translated[r.key] = r.text;
      }
      process.stdout.write(`  ${Math.min(i + batchSize, keys.length)}/${keys.length}\r`);
    }

    const structured = unflatten(translated);
    const outPath = path.resolve(`messages/${target}.json`);
    fs.writeFileSync(outPath, JSON.stringify(structured, null, 2) + "\n", "utf-8");
    console.log(`  ✓ Written to messages/${target}.json`);
  }

  console.log("\n✅ All translations complete!");
}

translateAll().catch(console.error);
