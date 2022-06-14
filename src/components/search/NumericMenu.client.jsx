/**
 * Numeric menu for Algiolia InstantSearch price facet
 * https://www.algolia.com/doc/api-reference/widgets/numeric-menu/react-hooks/
 */
import React from 'react';
import {useNumericMenu} from 'react-instantsearch-hooks';

export function NumericMenu(props) {
  const {items, refine} = useNumericMenu(props);

  return (
    <div className="ais-NumericMenu">
      <ul className="ais-NumericMenu-list">
        {items.map((item) => (
          <li
            key={item.value}
            className={
              item.isRefined
                ? 'ais-NumericMenu-item--selected'
                : 'ais-NumericMenu-item'
            }
          >
            <label className="ais-NumericMenu-label">
              <input
                className="ais-NumericMenu-radio"
                type="radio"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              <span className="ais-NumericMenu-labelText">{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
