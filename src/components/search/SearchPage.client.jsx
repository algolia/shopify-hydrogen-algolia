import {
  InstantSearch,
  InstantSearchSSRProvider,
  SearchBox,
  Pagination,
  Highlight,
  Configure,
  Hits,
  RefinementList,
  SortBy,
  HitsPerPage,
  ClearRefinements,
  RangeInput,
} from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import {singleIndex} from 'instantsearch.js/cjs/lib/stateMappings';
import {history} from 'instantsearch.js/cjs/lib/routers';
import algoConfig from '../../../algolia.config.json';
import {Image} from '@shopify/hydrogen';
import {Insights} from './AlgoliaInsights.client';
import '../../styles/search.css';
import '../../styles/theme.css';

const indexName = algoConfig.prefix + 'products';
const appId = algoConfig.appId;
const apiKey = algoConfig.appKey;
const searchClient = algoliasearch(appId, apiKey);

const Hit = ({hit, sendEvent}) => (
  <article className="hit">
    <a
      href={
        '/products/' +
        hit.handle +
        '?queryID=' +
        hit.__queryID +
        '&objectID=' +
        hit.objectID
      }
      onClick={() => {
        // Using insights hook to send event
        sendEvent('click', hit, 'PLP - Product Clicked');
      }}
    >
      <header className="hit-image-container">
        <Image
          src={hit.image}
          alt={hit.title}
          width="auto"
          height="auto"
          className="hit-image"
        />
      </header>
      <div className="hit-info-container">
        <p className="hit-category">{hit.product_type}</p>
        <h1>
          <Highlight attribute="title" hit={hit} />
        </h1>

        <footer>
          <p>
            <span className="hit-em">$</span> <strong>{hit.price}</strong>{' '}
          </p>
        </footer>
      </div>
    </a>
  </article>
);

export function SearchPage({serverState, serverUrl, collection}) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        routing={{
          stateMapping: singleIndex(indexName),
          router: history({
            getLocation: () =>
              typeof window === 'undefined'
                ? new URL(serverUrl)
                : window.location,
          }),
        }}
      >
        <Insights />
        <header className="header">
          {collection && <p className="header-title">{collection}</p>}
          <SearchBox
            submit={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 18 18"
              >
                <g
                  fill="none"
                  fillRule="evenodd"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.67"
                  transform="translate(1 1)"
                >
                  <circle cx="7.11" cy="7.11" r="7.11" />
                  <path d="M16 16l-3.87-3.87" />
                </g>
              </svg>
            }
          />
        </header>
        {!collection ? (
          <Configure distinct clickAnalytics />
        ) : (
          <Configure
            filters={"collections:'" + collection + "'"}
            distinct
            clickAnalytics
          />
        )}
        <main className="container">
          <div className="container-wrapper">
            <section className="container-filters">
              <div className="container-header">
                <h2>Filters</h2>
                <div className="clear-filters">
                  <ClearRefinements
                    translations={{
                      reset: (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 11 11"
                          >
                            <g fill="none" fillRule="evenodd" opacity=".4">
                              <path d="M0 0h11v11H0z" />
                              <path
                                fill="#000"
                                fillRule="nonzero"
                                d="M8.26 2.75a3.896 3.896 0 1 0 1.102 3.262l.007-.056a.49.49 0 0 1 .485-.456c.253 0 .451.206.437.457 0 0 .012-.109-.006.061a4.813 4.813 0 1 1-1.348-3.887v-.987a.458.458 0 1 1 .917.002v2.062a.459.459 0 0 1-.459.459H7.334a.458.458 0 1 1-.002-.917h.928z"
                              />
                            </g>
                          </svg>
                          Clear filters
                        </>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="container-body">
                <div className="ais-Panel-header">Brands</div>
                <RefinementList
                  attribute="vendor"
                  searchable={true}
                  showMore={true}
                  placeholder="Search for brands…"
                />
              </div>
              <div className="ais-Panel-header">Categories</div>
              <RefinementList attribute="product_type" showMore={true} />
              <div className="ais-Panel-header">Collections</div>
              <RefinementList attribute="collections" />
              <div className="ais-Panel-header">Price</div>
              <RangeInput attribute="price" />
            </section>
          </div>
          <section className="container-results">
            <header className="container-header container-options">
              <SortBy
                className="container-option"
                // Get sorting indices from shopify integration
                items={[
                  {
                    label: 'Sort by featured',
                    value: algoConfig.prefix + 'products',
                  },
                  {
                    label: 'Price ascending',
                    value: algoConfig.prefix + 'products_price_asc',
                  },
                  {
                    label: 'Price descending',
                    value: algoConfig.prefix + 'products_price_desc',
                  },
                  {
                    label: 'Recently added',
                    value: algoConfig.prefix + 'products_published_at_desc',
                  },
                ]}
              />
              <HitsPerPage
                className="container-option"
                items={[
                  {
                    label: '16 hits per page',
                    value: 16,
                    default: true,
                  },
                  {
                    label: '32 hits per page',
                    value: 32,
                  },
                  {
                    label: '64 hits per page',
                    value: 64,
                  },
                ]}
              />
            </header>
            <Hits hitComponent={Hit} />
            <footer className="container-footer">
              <Pagination padding={2} />
            </footer>
          </section>
        </main>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}
