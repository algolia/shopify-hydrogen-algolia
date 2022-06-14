/**
 * Mount Algolia insights middleware
 * https://www.algolia.com/doc/api-reference/widgets/insights/react-hooks/?client=js
 */
import {createInsightsMiddleware} from 'instantsearch.js/es/middlewares';
import {useEffect} from 'react';
import {useConnector} from 'react-instantsearch-hooks-web';
import algoConfig from '../../../algolia.config.json';

const connectMiddleware = (renderFn, unmountFn) => (widgetParams) => ({
  init(initOptions) {
    renderFn(
      {
        ...this.getWidgetRenderState(initOptions),
        instantSearchInstance: initOptions.instantSearchInstance,
      },
      true,
    );
  },

  render(renderOptions) {
    const renderState = this.getWidgetRenderState(renderOptions);

    renderFn(
      {
        ...renderState,
        instantSearchInstance: renderOptions.instantSearchInstance,
      },
      false,
    );
  },

  getWidgetRenderState(renderOptions) {
    return {
      use: (...args) => renderOptions.instantSearchInstance.use(...args),
      unuse: (...args) => renderOptions.instantSearchInstance.unuse(...args),
      widgetParams,
    };
  },

  dispose() {
    unmountFn();
  },
});

export function Insights() {
  const {use} = useConnector(connectMiddleware);

  useEffect(() => {
    const insightsClient = window.aa;
    insightsClient('init', {
      appId: algoConfig.appId,
      apiKey: algoConfig.appKey,
      useCookie: true,
    });
    const middleware = createInsightsMiddleware({
      insightsClient,
    });

    use(middleware);
  }, [use]);

  return null;
}
