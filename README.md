# Algolia Shopify integration

Build Search and Discovery experience with Algolia, a Shopify Plus Certified Partner

[Check out the docs](https://www.algolia.com/doc/integration/shopify/getting-started/quick-start/)

[Configuration](https://www.algolia.com/doc/integration/shopify/getting-started/configuration/)

# Hydrogen App

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

# Hydrogen & Algolia

[Demo site](https://shopify-hydrogen-algolia-36172cef840994cbdf69.o2.myshopify.dev/)

## Configuration for Hydrogen & Algolia
- Algolia

Update `algolia.config.json` with your Algolia APP ID & API KEY. 

Update `algolia.config.json` with your shopify integration prefix ("shopify_" for example) and query sugguestion index name.

- Hydrogen

Update `hydrogen.config.js` with your shop's domain and Storefront API token.

## What's in this template

- Algolia InstantSearch & Autocomplete libraries
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Playwright](https://playwright.dev)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Javascript linting with [ESLint](https://eslint.org) and the Hydrogen [ESLint plugin](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin)

## Getting started

**Requirements:**

- Node.js version 16.5.0 or higher
- Yarn

```bash
yarn
yarn dev
```

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `yarn preview`:

```bash
yarn build
yarn preview
```

## Building for production

```bash
yarn build
```

## Running tests

This project contains basic end-to-end (E2E) tests in the `/tests/e2e` folder powered by [Vitest](https://vitest.dev).

You can run tests in development, and they will automatically reload when you make changes to the component you provide to `hydrogen.watchForUpdates()`:

```bash
yarn test
```

To run tests in a continuous-integration (CI) environment like GitHub Actions:

```bash
yarn test:ci
```
