# UI Coding Standards

## Component Library

**ONLY shadcn/ui components must be used for all UI in this project.**

- Do NOT create custom components. If a UI element is needed, find the appropriate shadcn/ui component.
- Do NOT use raw HTML elements for UI (e.g. no bare `<button>`, `<input>`, `<dialog>`, etc.) — use the shadcn/ui equivalents.
- Do NOT use any other component library alongside shadcn/ui.

All shadcn/ui components live in `src/components/ui/`. Add new shadcn/ui components via the CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

## Date Formatting

Use **date-fns** for all date formatting. No other date utility library should be used.

Dates must be formatted with an ordinal day suffix, abbreviated month, and full year:

| Date | Formatted output |
|------|-----------------|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-06-04 | 4th Jun 2024 |

### Implementation

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  const day = date.getDate();
  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${ordinal} ${format(date, "MMM yyyy")}`;
}
```

Use this helper (or an equivalent) wherever a date is displayed in the UI.
