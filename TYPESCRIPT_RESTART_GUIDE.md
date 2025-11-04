# TypeScript Server Restart Instructions

The TypeScript errors you're seeing are caused by the TypeScript language server cache.

## Quick Fix Options:

### Option 1: VS Code Command Palette (Recommended)
1. Press `Ctrl + Shift + P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### Option 2: Reload VS Code Window
1. Press `Ctrl + Shift + P`
2. Type "Developer: Reload Window"
3. Press Enter

### Option 3: Close and Reopen VS Code
Simply close VS Code and reopen the workspace

## Why This Happens:
TypeScript's language server sometimes doesn't pick up file changes immediately, especially after:
- Creating new files
- Major edits to action files
- Changes to exported functions

## Verify It's Fixed:
After restarting, check that these errors are gone:
- ✓ `Cannot find module '@/lib/actions/comments'`
- ✓ Type errors in admin/comments/page.tsx

The file definitely exists at:
`lib/actions/comments.ts`

And tsconfig.json has the correct path mapping:
`"@/*": ["./*"]`
