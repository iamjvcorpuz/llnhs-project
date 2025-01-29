import React from "react";
// import { Table } from "react-bootstrap";
import { useTable } from "react-table";
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
const ReactTable = ({ columns, data, className }) => {
  // you can get the react table functions by using the hook useTable
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });
//   console.log(getTableProps)
  return (
    <table className={className} {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => {
            const { key, ...getHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return <tr key={key} {...getHeaderGroupProps} >
                {headerGroup.headers.map(column => {
                const { key, ...getHeaderProps } = column.getHeaderProps({ style: {...column},className: column.className}); 
                return <th key={key} {...getHeaderProps} >{column.render("Header")}</th>
                })}
            </tr>
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
            prepareRow(row);
            const { key, ...getRowProps } = row.getRowProps();
            return (
                <tr key={key} {...getRowProps}>
                    {row.cells.map(cell => {
                        const { key, ...restCellProps } = cell.getCellProps({style: {...cell},className: cell.column.className});
                        return <td key={key} {...restCellProps}>{cell.render("Cell")}</td>
                    })}
                </tr>
            )
        })}
      </tbody>
    </table>
  );
};

export default ReactTable;