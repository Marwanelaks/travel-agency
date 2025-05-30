import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/products/ProductForm"
import { getProductById, updateProduct } from "@/services/productService"
import { Product, ProductFormData } from "@/types/product"
import { useToast } from "@/components/ui/use-toast"

export function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate("/dashboard/products")
        return
      }

      try {
        setIsLoading(true)
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive"
        })
        navigate("/dashboard/products")
      } finally {
        setIsLoading(false)
      }
    }


    fetchProduct()
  }, [id, navigate, toast])

  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return

    try {
      setIsSubmitting(true)
      await updateProduct(id, data)
      toast({
        title: "Success",
        description: "Product updated successfully!",
        variant: "success"
      })
      navigate(`/dashboard/products/${id}`)
    } catch (err) {
      console.error("Error updating product:", err)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/dashboard/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>
      
      <div className="rounded-md border bg-card p-6">
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  )
}
