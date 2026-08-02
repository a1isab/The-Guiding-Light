import * as fs from "fs";
import * as path from "path";
import translate from "@iamtraction/google-translate";

const MISSING = [
  ["nav", "my_classes", "My Classes"],
  ["dashboard", "no_classes_yet", "You haven't joined any classes yet"],
  ["dashboard", "join_class_prompt", "Enter an invite code below to join a class"],
  ["auth", "onboarding", "welcome_title", "Welcome to The Guiding Light"],
  ["auth", "onboarding", "welcome_subtitle", "Let's personalize your learning experience"],
  ["auth", "onboarding", "step_name", "Display Name"],
  ["auth", "onboarding", "name_placeholder", "What should we call you?"],
  ["auth", "onboarding", "step_level", "Knowledge Level"],
  ["auth", "onboarding", "level_beginner", "Beginner"],
  ["auth", "onboarding", "level_intermediate", "Intermediate"],
  ["auth", "onboarding", "level_advanced", "Advanced"],
  ["auth", "onboarding", "step_interests", "Topics of Interest"],
  ["auth", "onboarding", "interest_quran", "Quran"],
  ["auth", "onboarding", "interest_hadith", "Hadith"],
  ["auth", "onboarding", "interest_fiqh", "Fiqh"],
  ["auth", "onboarding", "interest_aqeedah", "Aqeedah"],
  ["auth", "onboarding", "interest_seerah", "Seerah"],
  ["auth", "onboarding", "interest_arabic", "Arabic Language"],
  ["auth", "onboarding", "step_goals", "Learning Goals"],
  ["auth", "onboarding", "goals_placeholder", "What do you hope to achieve?"],
  ["auth", "onboarding", "step_subjects", "Teaching Subjects"],
  ["auth", "onboarding", "subjects_placeholder", "What subjects do you teach?"],
  ["auth", "onboarding", "step_experience", "Experience Level"],
  ["auth", "onboarding", "experience_beginner", "New Teacher"],
  ["auth", "onboarding", "experience_intermediate", "Experienced"],
  ["auth", "onboarding", "experience_advanced", "Veteran Educator"],
  ["auth", "onboarding", "next", "Next"],
  ["auth", "onboarding", "previous", "Previous"],
  ["auth", "onboarding", "complete", "Complete"],
  ["auth", "onboarding", "skip", "Skip for now"],
  ["auth", "onboarding", "step_of", "{current} / {total}"],
];

async function translateText(text: string, target: string): Promise<string> {
  if (!text.trim() || !/[a-zA-Z]/.test(text) || /^\{[\w]+\}$/.test(text.trim())) return text;
  try {
    const result = await translate(text, { from: "en", to: target });
    return result.text;
  } catch (err) {
    console.warn(`  failed: "${text}" -> ${target}: ${err}`);
    return text;
  }
}

async function main() {
  for (const target of ["ar", "ur", "fr"]) {
    const file = path.resolve(`messages/${target}.json`);
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    let changed = 0;
    for (const parts of MISSING) {
      const text = parts[parts.length - 1];
      const keyPath = parts.slice(0, -1);
      let node = data;
      for (const part of keyPath.slice(0, -1)) {
        if (!node[part]) node[part] = {};
        node = node[part];
      }
      const leaf = keyPath[keyPath.length - 1];
      if (node[leaf] !== undefined) continue;
      const translated = await translateText(text, target);
      node[leaf] = translated;
      changed++;
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`${target}: added ${changed} keys`);
  }
}

main().catch(console.error);
