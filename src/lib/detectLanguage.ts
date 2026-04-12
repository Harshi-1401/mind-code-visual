import type { Language } from "./constants";

export function detectLanguage(code: string): Language {
  if (/^\s*#include\s+</.test(code) || /\bcout\b/.test(code) || /\bstd::/.test(code)) return "cpp";
  if (/\bpublic\s+class\b/.test(code) || /\bSystem\.out\.print/.test(code) || /\bpublic\s+static\s+void\s+main/.test(code)) return "java";
  if (/\bdef\s+\w+\s*\(/.test(code) || /\bprint\s*\(/.test(code) || /^\s*import\s+\w+/m.test(code)) return "python";
  return "javascript";
}
