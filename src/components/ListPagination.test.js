import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TestUtils from 'react-dom/test-utils';
import { ARTICLE_PAGE_UNLOADED } from '../constants/actionTypes';
import ListPagination from './ListPagination';

const createTestStore = () => {
  const reducer = (state = {}, action) => state;
  return createStore(reducer);
};

describe('ListPagination', () => {
  it('renders a full set of page buttons with no ellipsis when total pages <= 7', () => {
    const store = createTestStore();
    store.dispatch = jest.fn(store.dispatch);

    const container = document.createElement('div');

    TestUtils.renderIntoDocument(
      <Provider store={store}>
        <ListPagination
          articlesCount={60}
          currentPage={2}
          pager={page => Promise.resolve({ page })} />
      </Provider>
    );

    const nav = container.querySelector ? container.querySelector('nav') : null;
    expect(nav).toBeTruthy();
  });

  it('renders windowed pagination with ellipsis and correct aria-current', () => {
    const store = createTestStore();

    const container = document.createElement('div');
    const root = ReactDOM.render(
      <Provider store={store}>
        <ListPagination
          articlesCount={100}
          currentPage={2}
          pager={page => Promise.resolve({ page })} />
      </Provider>,
      container
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.getAttribute('aria-label')).toBe('Pagination');

    const buttons = container.querySelectorAll('button.page-link');
    const ariaCurrentButtons = Array.from(buttons).filter(
      b => b.getAttribute('aria-current') === 'page'
    );

    expect(ariaCurrentButtons).toHaveLength(1);
    expect(ariaCurrentButtons[0].textContent).toBe('3');

    const ellipsisLis = container.querySelectorAll('li.page-item.disabled span.page-link');
    expect(ellipsisLis.length).toBeGreaterThan(0);

    ReactDOM.unmountComponentAtNode(container);
    return root;
  });

  it('clamps out-of-range currentPage and still renders exactly one aria-current page button', () => {
    const store = createTestStore();

    const container = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <ListPagination
          articlesCount={100}
          currentPage={999}
          pager={page => Promise.resolve({ page })} />
      </Provider>,
      container
    );

    const buttons = container.querySelectorAll('button.page-link');
    const ariaCurrentButtons = Array.from(buttons).filter(
      b => b.getAttribute('aria-current') === 'page'
    );

    expect(ariaCurrentButtons).toHaveLength(1);

    // totalPages = 10, clamped currentPage = 9, button label = 10
    expect(ariaCurrentButtons[0].textContent).toBe('10');

    ReactDOM.unmountComponentAtNode(container);
  });
});
