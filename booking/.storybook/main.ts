import type { StorybookConfig } from '@storybook/nextjs'; // Changed import

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    // Removed experimental test addon
  ],

  // Simplified framework declaration
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },

  staticDirs: ["../public"],

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;