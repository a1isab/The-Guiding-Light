import * as fs from "fs";
import translate from "@iamtraction/google-translate";

const src = JSON.parse(fs.readFileSync("messages/en.json", "utf-8"));

interface NestedRecord {
  [key: string]: string | NestedRecord;
}

function flatten(obj: NestedRecord, prefix = ""): Record<string, string> {
  const r: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + "." + k : k;
    if (typeof v === "string") r[key] = v;
    else Object.assign(r, flatten(v, key));
  }
  return r;
}

function unflatten(map: Record<string, string>): NestedRecord {
  const root: NestedRecord = {};
  for (const [key, value] of Object.entries(map)) {
    const parts = key.split(".");
    let cur: NestedRecord = root;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]] as NestedRecord;
    }
    cur[parts[parts.length - 1]] = value;
  }
  return root;
}

async function run() {
  const flat = flatten(src);
  const keys = Object.keys(flat);
  const translated: Record<string, string> = {};

  for (let i = 0; i < keys.length; i++) {
    const text = flat[keys[i]];
    if (!text.trim() || /^\{/.test(text.trim()) || !/[a-zA-Z]/.test(text)) {
      translated[keys[i]] = text;
    } else {
      try {
        const r = await translate(text, { from: "en", to: "fr" });
        translated[keys[i]] = r.text;
      } catch {
        translated[keys[i]] = text;
      }
    }
    if ((i + 1) % 10 === 0) process.stdout.write(`\r${i + 1}/${keys.length}`);
  }

  fs.writeFileSync("messages/fr.json", JSON.stringify(unflatten(translated), null, 2) + "\n");
  console.log("\n✓ French translation done");
}

run().catch(console.error);
