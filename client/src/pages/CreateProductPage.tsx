import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { ProductForm } from "@/components/products/ProductForm"
import { createProduct } from "@/services/productService"
import { ProductFormData } from "@/types/product"
import { useToast } from "@/components/ui/use-toast"

export function CreateProductPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true)
      await createProduct(data)
      toast({
        title: "Success",
        description: "Product created successfully!",
        variant: "success"
      })
      navigate("/dashboard/products")
    } catch (err) {
      console.error("Error creating product:", err)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
      </div>
      
      <div className="rounded-md border bg-card p-6">
        <ProductForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  )
}
