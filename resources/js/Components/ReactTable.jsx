import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
import { useTable, usePagination, useRowSelect } from "react-table";
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

const ReactTable = ({ columns, data, className,showHeader,showPagenation ,defaultPageSize}) => {
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
      console.log(temp1)
      Array.prototype.push.apply(temp1,Array.from(Array(defaultPageSize-data.length)).map(e => {
        return {
          no: null
        }
      }));
      console.log(temp1,zeroRow)
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
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable({
    columns: columns,
    data: mainData,
    initialState: {pageSize : defaultPageSize_}
  },
  usePagination,
  useRowSelect);
  //{pageSize : defaultPageSize}

  return (<>
    <table className={className} {...getTableProps()}>
      {(showHeader==undefined||(typeof(showHeader)!=undefined&&showHeader==true?true:false))?<thead>
        {headerGroups.map(headerGroup => {
            const { key, ...getHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return <tr key={key} {...getHeaderGroupProps} >
                {headerGroup.headers.map(column => {
                const { key, ...getHeaderProps } = column.getHeaderProps({ style: {...column},className: column.className}); 
                return <th key={key} {...getHeaderProps} >{column.render("Header")}</th>
                })}
            </tr>
        })}
      </thead>:null}      
      <tbody {...getTableBodyProps()} className="table-group-divider">
      {page.map((row, i) => {
        prepareRow(row);
        const { key, ...getRowProps } = row.getRowProps(); 
        return (
            <tr key={key} {...getRowProps}>
                {row.cells.map(cell => {
                    const { key, ...restCellProps } = cell.getCellProps({style: {...cell},className: cell.column.className});
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