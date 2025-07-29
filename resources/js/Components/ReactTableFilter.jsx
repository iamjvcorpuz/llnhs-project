// import { Input, CustomInput } from "reactstrap"
export const DefaultColumnFilter = ({
    column: {
      filterValue,
      setFilter,
      preFilteredRows: { length },
      filterInput,
      filterMethod
    },
  }) => {
    if(typeof(filterInput)!="undefined") {
        // console.log(filterInput)
        return (<>{filterInput({ filter: filterValue,onChange:setFilter })}</>);
    } else {
        return (
        <input
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            className="form-control"
            placeholder={``}
        />
        )        
    }

  }

  export const Filter = ({ column }) => {
    if(typeof(column.filterable) !="undefined" && (column.filterable == true)) {
        return (
            <div >
              {column.canFilter && column.render("Filter")}
            </div>
          )
    } else  if(typeof(column.filterInput) !="undefined") {
        return (
            <div >
              {column.canFilter && column.render("Filter")}
            </div>
          )
    } else {
        return null;
    }
  }