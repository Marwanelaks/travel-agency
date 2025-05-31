import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey: string
  filterOptions?: {
    label: string
    value: string
    options: { label: string; value: string }[]
  }[]
  onAddNew?: () => void
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filterOptions = [],
  onAddNew,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter by ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterOptions.map((filter) => (
          <DataTableFacetedFilter
            key={filter.value}
            column={table.getColumn(filter.value)}
            title={filter.label}
            options={filter.options}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <span className="sr-only">Reset filters</span>
          </Button>
        )}
      </div>
      {onAddNew && (
        <Button 
          className="h-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddNew();
          }}
          type="button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      )}
    </div>
  )
}
