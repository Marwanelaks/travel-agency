import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/products/ProductsTable"
import { Product } from "@/types/product"
import { getProducts, deleteProduct } from "@/services/productService"
import { useToast } from "@/components/ui/use-toast"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`)
  }

  const handleView = (product: Product) => {
    navigate(`/products/${product.id}`)
  }

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id)
        toast({
          title: "Success",
          description: `${product.name} has been deleted.`,
          variant: "success"
        })
        fetchProducts()
      } catch (err) {
        console.error("Error deleting product:", err)
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => navigate("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <div className="rounded-md border bg-card">
        <ProductsTable
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
