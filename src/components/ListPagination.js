import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import { SET_PAGE } from '../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  onSetPage: (page, payload) =>
    dispatch({ type: SET_PAGE, page, payload })
});

const ListPagination = props => {
  if (props.articlesCount <= 10) {
    return null;
  }

  const totalPages = Math.ceil(props.articlesCount / 10);
  const currentPage = Math.min(Math.max(props.currentPage || 0, 0), totalPages - 1);

  const getPageItems = (totalPages, currentPage) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => ({ type: 'page', page: i }));
    }

    const clampedWindowStart = Math.max(1, currentPage - 2);
    const clampedWindowEnd = Math.min(totalPages - 2, currentPage + 2);

    const items = [];

    items.push({ type: 'page', page: 0 });

    if (clampedWindowStart > 1) {
      items.push({ type: 'ellipsis', key: 'start-ellipsis' });
    }

    for (let p = clampedWindowStart; p <= clampedWindowEnd; p++) {
      items.push({ type: 'page', page: p });
    }

    if (clampedWindowEnd < totalPages - 2) {
      items.push({ type: 'ellipsis', key: 'end-ellipsis' });
    }

    items.push({ type: 'page', page: totalPages - 1 });

    return items;
  };

  const setPage = page => {
    if(props.pager) {
      props.onSetPage(page, props.pager(page));
    }else {
      props.onSetPage(page, agent.Articles.all(page))
    }
  };

  const pageItems = getPageItems(totalPages, currentPage);

  return (
    <nav aria-label="Pagination">
      <ul className="pagination">

        {
          pageItems.map(item => {
            if (item.type === 'ellipsis') {
              return (
                <li
                  className='page-item disabled'
                  key={item.key}>
                  <span className='page-link'>…</span>
                </li>
              );
            }

            const page = item.page;
            const isCurrent = page === currentPage;

            return (
              <li
                className={ isCurrent ? 'page-item active' : 'page-item' }
                key={page.toString()}>

                <button
                  type='button'
                  className='page-link'
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-disabled={isCurrent ? 'true' : undefined}
                  onClick={isCurrent ? undefined : ev => {
                    ev.preventDefault();
                    setPage(page);
                  }}>
                  {page + 1}
                </button>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ListPagination);
