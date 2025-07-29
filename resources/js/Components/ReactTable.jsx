import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
import { useTable, usePagination, useRowSelect,useSortBy ,useFilters} from "react-table";
import { Filter, DefaultColumnFilter } from './ReactTableFilter';
// import styled from 'styled-components'
// import {
//     createColumnHelper,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
//   } from '@tanstack/react-table'
/**
 * As in the previous versions, a react-table accepts colums where at the core we have a field Header, and accessor
 * As in the previous versions, a react-table has data that consist of an array of JSONs
 */

const ReactTable = ({ columns, data, className,showHeader,showPagenation ,defaultPageSize,loading,getTrProps}) => {
  // console.log(columns_, data_,columns_!==undefined,data_!== undefined)
  // console.log(defaultPageSize);
  // let columns = React.useMemo(() => (columns!=undefined)?columns:[],[]); 
  // let data_ = data;
  // console.log("defaultPageSize",defaultPageSize,typeof(defaultPageSize)!="undefined");
  let defaultPageSize_ = typeof(defaultPageSize)!="undefined"?defaultPageSize:5
  let zeroRow = Array.from(Array((defaultPageSize!="undefined")?defaultPageSize_:10)).map(e => {
    return {
      no: null
    }
  });
  
  let [mainData,setMainData] = useState([]); 
  let [useTableOptions,setUseTableOptions] = useState(null); 
  useEffect(() => {
    if((data!=undefined) && data.length == 0) {
      defaultPageSize = 5;
      setMainData(zeroRow)
    } else if( typeof(defaultPageSize)!="undefined" && data.length > 0 && data.length < defaultPageSize) {
      let temp1 = [];
      let temp2 = [];
      // temp1.concat(data)
      data.forEach(element => {
        temp1.push(element);
      });
      // console.log(temp1)
      Array.prototype.push.apply(temp1,Array.from(Array(defaultPageSize-data.length)).map(e => {
        return {
          no: null
        }
      }));
      // console.log(temp1,zeroRow)
      setMainData(temp1)
    } else { 
      defaultPageSize = 5;
      setMainData(data)
    }
  },[data]);

  // useEffect(() => {
  //   if((defaultPageSize!=undefined) && data != "" && useTableOptions == null) {
  //     console.log(useTableOptions,defaultPageSize)
  //     setUseTableOptions({
  //       initialState: {pageSize : defaultPageSize}
  //     })
  //   }
  // });
  // let mainData = React.useMemo(() => (data!=undefined&&data.length>0)?data:[],[zeroRow]); 

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    onRowSelectionChange,
    state: { pageIndex, pageSize, selectedRowIds }
  } = useTable({
    columns: columns,
    data: mainData,
    defaultColumn: { Filter: DefaultColumnFilter },
    initialState: {pageSize : defaultPageSize_}
  },
  useFilters,
  useSortBy, 
  usePagination,
  useRowSelect);
  //{pageSize : defaultPageSize}
  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }
  return (<>

    {(typeof(loading)!="undefined"&&loading==true)?<div id="loadingSpinner" className="loading-spinner d-flex justify-content-center align-items-center" >
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>:null}
    <table className={className} {...getTableProps()}>
      {(showHeader==undefined||(typeof(showHeader)!=undefined&&showHeader==true?true:false))?<thead>
        {headerGroups.map(headerGroup => {
            const { key, ...getHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return <tr key={key} {...getHeaderGroupProps} >
                {headerGroup.headers.map(column => {
                const { key, ...getHeaderProps } = column.getHeaderProps({ style: {width: column.width},className: column.className,...column.getSortByToggleProps()}); 
                return <th key={key} {...getHeaderProps} >{column.render("Header")} {generateSortingIndicator(column)} </th>
                })}
            </tr>
        })}

      {headerGroups.map(headerGroup => {
          const { key, ...getHeaderGroupProps } = headerGroup.getHeaderGroupProps(); 
          if(headerGroup.headers != null && headerGroup.headers.length > 0 && (headerGroup.headers.some(e => e.hasOwnProperty("filterable")) || headerGroup.headers.some(e => e.hasOwnProperty("filterMethod")) || headerGroup.headers.some(e => e.hasOwnProperty("filterMethod")))) {
            return <tr key={`tr_filter_${key}`}  >
                {headerGroup.headers.map(column => {  
                  const { key, ...getHeaderProps } = column.getHeaderProps({ style: {width: column.width},className: column.className});
                  return <td key={`td_filter_${key}`}  {...getHeaderProps} ><Filter column={column} /> </td> 
                })}
            </tr>
          }
      })} 
      </thead>:null} 
      <tbody {...getTableBodyProps()} className="table-group-divider">
      {rows.map((row, i) => {
        prepareRow(row);
        const { key, ...getRowProps } = row.getRowProps(getTrProps && getTrProps(row.original));
        return (
            <tr key={key} {...getRowProps}>
                {row.cells.map(cell => { 
                    const { key, ...restCellProps } = cell.getCellProps({style: {width: cell.column.width},className: cell.column.className});
                    if(typeof(cell.value)!="undefined") {
                      return <td key={key} {...restCellProps}>{cell.render("Cell")}</td>
                    } else { 
                      return <td key={key} {...restCellProps} className="p-3"></td>
                    }
                })}
            </tr>
        )
      })}
      </tbody>
    </table>
    <div className={`card-footer clearfix ${(showPagenation==undefined||(typeof(showPagenation)!=undefined&&showPagenation==true?true:false))?'':'d-none'}`}>
        <ul className="pagination">
          <li className="page-item"><button className="page-link"  onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button></li>
          <li className="page-item"><button className="page-link" onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button></li>
          <li className="page-item"><button className="page-link" onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button></li>
          <li className="page-item"><button className="page-link" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button></li>
          <li className="col-lg-6">
            <div className="form-inline">
              <span className="ml-2">
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </span>
              <span>
                | Go to page:{' '}
                <input
                  type="number" 
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(page)
                  }}
                  style={{ width: '100px' }}
                />
              </span>
              <select 
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </li>
          {/* <li className="page-item"></li>
          <li className="page-item"></li> */}
        </ul>
    </div>
  </>);
};

export default ReactTable;