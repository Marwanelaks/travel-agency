import { RouteObject } from "react-router-dom"
import { ProductsPage } from "@/pages/ProductsPage"
import { CreateProductPage } from "@/pages/CreateProductPage"
import { ProductDetailPage } from "@/pages/ProductDetailPage"
import { EditProductPage } from "@/pages/EditProductPage"

export const productRoutes: RouteObject[] = [
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/new",
    element: <CreateProductPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/products/edit/:id",
    element: <EditProductPage />,
  },
]
