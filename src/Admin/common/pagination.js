import React, {memo, useState} from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({itemsPerPage=20, totalItems=0, setPage}) => {
    
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const handlePageClick = (event) => {
        setPage({page:event.selected});
    };
  
    return (
      <div className='pagination'>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={10}
          pageCount={pageCount}
          previousLabel="< Previous"
          renderOnZeroPageCount={null}
        />
      </div>
    );
  }

export default memo(Pagination);
