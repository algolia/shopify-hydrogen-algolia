/**
 * Algiolia Autocomplete component
 * https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/
 */
import React from 'react';
import {getAlgoliaResults} from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import {useEffect, useRef, createElement, Fragment} from 'react';
import {createRoot} from 'react-dom/client';
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions';
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches';
import {createAlgoliaInsightsPlugin} from '@algolia/autocomplete-plugin-algolia-insights';
import {autocomplete} from '@algolia/autocomplete-js';
import {Image} from '@shopify/hydrogen';
import '@algolia/autocomplete-theme-classic';
import algoConfig from '../../../algolia.config.json';

const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const searchClient = algoliasearch(appId, apiKey);

// Create recent search plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'hydrogen-algolia-demo',
  limit: 3,
});

// Create query suggestion plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: algoConfig.QSindex, // Get index name from Algolia config
  getSearchParams() {
    return {hitsPerPage: 3};
  },
  transformSource({source}) {
    return {
      ...source,
      getItemUrl({item}) {
        return '/search?q=' + item.query;
      }, //keyboard navigation
      templates: {
        ...source.templates,
        item(params) {
          const {item, html} = params;
          return html`<a className="aa-ItemLink" href="/search?q=${item.query}">
            ${source.templates.item(params).props.children}
          </a>`;
        },
      },
    };
  },
});

function ProductItem({hit, components}) {
  return (
    <a
      href={
        '/products/' +
        hit.handle +
        '?queryID=' +
        hit.__autocomplete_queryID +
        '&objectID=' +
        hit.objectID
      }
      className="aa-ItemLink"
    >
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <Image src={hit.image} alt={hit.title} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody">
          <p className="hit-category">{hit.product_type}</p>
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="title" />
          </div>
          <div className="aa-ItemContentDescription">
            <p>
              <span className="hit-em">$</span> <strong>{hit.price}</strong>{' '}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function AlgoliaAutocomplete() {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    const insightsClient = window.aa;
    // Init insights client
    insightsClient('init', {
      appId: algoConfig.appId,
      apiKey: algoConfig.appKey,
      useCookie: true,
    });
    const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({insightsClient});
    const search = autocomplete({
      container: containerRef.current,
      placeholder: 'Search for everything',
      openOnFocus: true,
      plugins: [
        recentSearchesPlugin,
        querySuggestionsPlugin,
        algoliaInsightsPlugin,
      ],
      onSubmit({state}) {
        window.location.replace('/search?q=' + state.query);
      }, //keyboard navigation
      getSources({query}) {
        return [
          {
            sourceId: 'collections',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'collections',
                    query,
                    params: {
                      hitsPerPage: 3,
                    },
                  },
                ],
              });
            }, // Shopify collections index
            getItemUrl({item}) {
              return '/collections/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Collections</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item}) {
                return (
                  <a
                    href={'/collections/' + item.handle}
                    className="aa-ItemLink"
                  >
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">{item.title}</div>
                    </div>
                  </a>
                );
              },
              noResults() {
                return 'No collections found';
              },
            },
          },
          {
            sourceId: 'pages',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'pages',
                    query,
                    params: {
                      hitsPerPage: 3,
                    },
                  },
                ],
              });
            }, // Shopify pages index
            getItemUrl({item}) {
              return '/pages/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Pages</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item}) {
                return (
                  <a href={'/pages/' + item.handle} className="aa-ItemLink">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">{item.title}</div>
                    </div>
                  </a>
                );
              },
              noResults() {
                return 'No pages found';
              },
            },
          },
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: algoConfig.prefix + 'products',
                    query,
                    params: {
                      hitsPerPage: 4,
                      distinct: true,
                      clickAnalytics: true,
                    },
                  },
                ],
              });
            }, // Shopify products index
            getItemUrl({item}) {
              return (
                '/products/' +
                item.handle +
                '?queryID=' +
                item.__autocomplete_queryID +
                '&objectID=' +
                item.objectID
              );
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Products</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({item, components}) {
                return <ProductItem hit={item} components={components} />;
              },
              noResults() {
                return 'No products found';
              },
            },
          },
          {
            sourceId: 'editorial',
            getItems() {
              return [
                {
                  title: 'Search in all products',
                  url: '/search?q=' + query,
                },
              ];
            },
            getItemUrl({item}) {
              return item.url;
            },
            templates: {
              item({item}) {
                return (
                  <a href={item.url} className="aa-ItemLink">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">
                        <div className="m-3 text-sm font-semibold text-blue-800">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              },
            },
          },
        ];
      },
      renderer: {createElement, Fragment, render: () => {}},
      render({elements}, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        const {
          recentSearchesPlugin,
          querySuggestionsPlugin,
          products,
          editorial,
          collections,
          pages,
        } = elements;

        // Use this function to render what you need along with `children`
        // Each state update will re-render
        // Render a horizontal federated search panel
        panelRootRef.current.render(
          <div className="aa-PanelLayout aa-Panel--scrollable">
            <div className="flex">
              <div className="flex-auto mr-3 ml-3">
                {recentSearchesPlugin}
                <div className="aa-SourceHeader">
                  <span className="aa-SourceHeaderTitle">Sugguestion</span>
                  <div className="aa-SourceHeaderLine" />
                </div>
                {querySuggestionsPlugin} {collections} {pages}
              </div>
              <div className="flex-auto">
                {products} {editorial}
              </div>
            </div>
          </div>,
        );
      },
    });
    return () => {
      search.destroy();
    };
  }, []);
  return <div ref={containerRef} />;
}
