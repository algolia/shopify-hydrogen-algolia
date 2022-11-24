/**
 * Mount Algolia insights middleware
 * https://www.algolia.com/doc/api-reference/widgets/insights/react-hooks/?client=js
 */
import {createInsightsMiddleware} from 'instantsearch.js/es/middlewares';
import {useLayoutEffect} from 'react';
import {useInstantSearch} from 'react-instantsearch-hooks-web';
import algoConfig from '../../../algolia.config.json';

export function Insights() {
  const {use} = useInstantSearch();

  useLayoutEffect(() => {
    const insightsClient = window.aa;
    insightsClient('init', {
      appId: algoConfig.appId,
      apiKey: algoConfig.appKey,
      useCookie: true,
    });
    const middleware = createInsightsMiddleware({
      insightsClient,
    });

    return use(middleware);
  }, [use]);

  return null;
}
