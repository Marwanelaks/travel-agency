import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Eye, Hotel, Plane, Ticket, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Product, ProductType } from "@/types/product"

const getTypeIcon = (type: ProductType) => {
  switch (type) {
    case 'hotel':
      return <Hotel className="h-4 w-4 mr-2" />
    case 'flight':
      return <Plane className="h-4 w-4 mr-2" />
    case 'sport':
      return <Activity className="h-4 w-4 mr-2" />
    case 'entertainment':
      return <Ticket className="h-4 w-4 mr-2" />
    default:
      return null
  }
}

const getTypeLabel = (type: ProductType) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

interface ProductsTableProps {
  data: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onView: (product: Product) => void
  isLoading?: boolean
}

export function ProductsTable({
  data,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ProductsTableProps) {
  const navigate = useNavigate()

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-10 w-10 rounded-md mr-3 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-muted mr-3 flex items-center justify-center">
                {getTypeIcon(product.type)}
              </div>
            )}
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                {product.location}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <div className="flex items-center">
            {getTypeIcon(type)}
            <span>{getTypeLabel(type)}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(product)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const typeOptions = [
    { label: "Hotel", value: "hotel" },
    { label: "Flight", value: "flight" },
    { label: "Sport", value: "sport" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Package", value: "package" },
    { label: "Other", value: "other" },
  ]

  const statusOptions = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      filterOptions={[
        {
          label: "Type",
          value: "type",
          options: typeOptions,
        },
        {
          label: "Status",
          value: "isActive",
          options: statusOptions,
        },
      ]}
      onAddNew={() => navigate("/products/new")}
      isLoading={isLoading}
    />
  )
}
