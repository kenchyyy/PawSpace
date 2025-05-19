import dotenv from "dotenv"
import path from "path"
import { defineConfig } from "vitest/config.js"
import tsconfigPaths from "vite-tsconfig-paths"
dotenv.config({ path: path.join(__dirname, ".env.test") })

export default defineConfig({
    test:{
        name: "database testing",
        environment: "node",
        fileParallelism: false,

        include: [
            "**/__test__/server/**/*.test.ts",
        ]
    },
    plugins: [tsconfigPaths()]
})