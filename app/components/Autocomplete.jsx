import {getAlgoliaResults} from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';
import {useEffect, useRef, createElement, Fragment} from 'react';
import {createRoot} from 'react-dom/client';
import {createQuerySuggestionsPlugin} from '@algolia/autocomplete-plugin-query-suggestions';
import {createLocalStorageRecentSearchesPlugin} from '@algolia/autocomplete-plugin-recent-searches';
import {autocomplete} from '@algolia/autocomplete-js';
import {createFetchRequester} from '@algolia/requester-fetch';
import {Image} from '@shopify/hydrogen';
import algoConfig from '../../algolia.config.json';

const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const searchClient = algoliasearch(appId, apiKey, {
  requester: createFetchRequester(),
});

export function Autocomplete(props) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    // Create recent search plugin
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'hydrogen-algolia',
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
            return `/search?q=${item.query}`;
          },
          templates: {
            header() {
              return (
                <>
                  <span className="aa-SourceHeaderTitle">Sugguestions</span>
                  <div className="aa-SourceHeaderLine" />
                </>
              );
            },
            item(params) {
              const {item, html} = params;
              return html`<a
                className="aa-ItemLink"
                href="/search?q=${item.query}"
              >
                ${source.templates.item(params).props.children}
              </a>`;
            },
          },
        };
      },
    });
    const ProductItem = ({hit, components}) => {
      return (
        <a href={'/products/' + hit.handle} className="aa-ItemLink">
          <div className="aa-ItemContent">
            <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
            <Image src={hit.image} alt={hit.title} width="40" height="50" />
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
    };
    const search = autocomplete({
      container: containerRef.current,
      placeholder: 'Search',
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      openOnFocus: true,
      // detachedMediaQuery: 'none',
      onSubmit({state}) {
        window.location.replace('/search?q=' + state.query);
      },
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
            },
            getItemUrl({item}) {
              return '/collections/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <>
                    <span className="aa-SourceHeaderTitle">Collections</span>
                    <div className="aa-SourceHeaderLine" />
                  </>
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
            },
            getItemUrl({item}) {
              return '/pages/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <>
                    <span className="aa-SourceHeaderTitle">Pages</span>
                    <div className="aa-SourceHeaderLine" />
                  </>
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
                      clickAnalytics: true,
                    },
                  },
                ],
              });
            },
            getItemUrl({item}) {
              return '/products/' + item.handle;
            },
            templates: {
              header() {
                return (
                  <>
                    <span className="aa-SourceHeaderTitle">Products</span>
                    <div className="aa-SourceHeaderLine" />
                  </>
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
  }, [props]);
  return <div ref={containerRef} />;
}
