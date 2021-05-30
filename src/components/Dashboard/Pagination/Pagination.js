import React from 'react';

const Pagination = ({launchesPerPage, totalLaunches, handlePage}) => {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalLaunches / launchesPerPage); i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav className="d-flex justify-content-end">
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a onClick={() => handlePage(number)} href="#" className="page-link">{number}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;