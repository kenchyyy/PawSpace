import { defineConfig } from "vitest/config.js";

export default defineConfig({
    test:{
        workspace: [
            "vitest.config.storybook.ts",
            "vitest.config.db.ts"
        ]
    }
})