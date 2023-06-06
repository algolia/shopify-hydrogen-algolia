
# Algolia + Shopify Hydrogen

Lightning fast search experiences on Shopify’s headless architecture.   
  
Now supporting Remixing Hydrogen v2 and full server-side rendering 🚀🚀🚀    
  
[Details](https://www.algolia.com/search-solutions/shopify/hydrogen/)   

[Demo site](https://shopify-hydrogen-algolia-36172cef840994cbdf69.o2.myshopify.dev/)   

  

# Algolia Shopify integration

Build Search and Discovery experience with Algolia, a Shopify Plus Certified Partner   
  
[Quick Start](https://www.algolia.com/doc/integration/shopify/getting-started/quick-start/)   
  
[Configuration steps](https://www.algolia.com/doc/integration/shopify/getting-started/configuration/)   

  

# Hydrogen App

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.   
  
[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)   


# Tutoriel

## What's in this template

- Algolia [React InstantSearch Hooks](https://www.algolia.com/doc/api-reference/widgets/react-hooks/) for search and collection pages   
  
- Algolia [Autocomplete](https://www.algolia.com/doc/api-reference/widgets/react-hooks/) for federated search bar   
  
- Hydrogen [demo store](https://hydrogen.shop/)   

  

## Getting started to index your data

Algolia for Shopify is a Shopify Plus certified app.  
  
To index your data, the extension calls the Shopify API and uses Shopify webhooks.   
   
[Quick Start](https://www.algolia.com/doc/integration/shopify/getting-started/quick-start/)   

  

## Generating Query Sugguestion index for autocomplete

The template supports Query Suggestion in search bar.   
   
Check out the [tutoriel](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/creating-a-query-suggestions-index/react-hooks/) to generate a query sugguestion index (optional)   

  

## Update the configuration file
  
`algolia.config.json` contains Algolia related configuration   
   
Update `algolia.config.json` with your Algolia APP ID & API KEY.   
   
Update `algolia.config.json` with your shopify extension prefix ("shopify_" for example) and query sugguestion index name.   

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

## Algolia related codes
  
-  `app/routes/($locale).search.jsx` using Algolia [React InstantSearch Hooks](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react-hooks/) to power Hydrogen's search page with Algolia   
   
-  `app/routes/($locale).collections.$collectionHandle.jsx` using Algolia [React InstantSearch Hooks](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react-hooks/) to power Hydrogen's collection pages with Algolia   
   
-  `app/components/Autocomplete.jsx` creates federated search bar component using Algolia [Autocomplete](https://www.algolia.com/doc/api-reference/widgets/react-hooks/)   
    
-  `app/styles/search.css` and `app/styles/autocomplete.css`   
   
## Build your own hydrogen storefront with Algolia
   
### Install Algolia related libraries
   
[React InstantSearch Hooks](https://www.algolia.com/doc/api-reference/widgets/react-hooks/)
      
```bash
yarn add algoliasearch react-instantsearch-hooks-web react-instantsearch-hooks-server @algolia/requester-fetch
```
   
[Autocomplete](https://www.algolia.com/doc/api-reference/widgets/react-hooks/)   

```bash
yarn add algoliasearch @algolia/autocomplete-js @algolia/autocomplete-plugin-query-suggestions @algolia/autocomplete-plugin-recent-searches
```
   
### Implement InstantSearch for search and browse
   
Server-side rendering InstantSearch can be integrated in Hydrogen Remix.   
   
The implementation is possible for any Hydrogen pages.   
   
[Tutoriel](https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react-hooks/)   
   
### Implement Autocomplete for federated search bar
   
Autocomplete is client-side only and needs to be mounted when the page renders.   

[Mount Autocomplete with React](https://www.algolia.com/doc/ui-libraries/autocomplete/integrations/using-react/)   