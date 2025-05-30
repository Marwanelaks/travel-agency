import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, FileText, Code, Server, Database } from 'lucide-react';

export function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Documentation</h2>
          <p className="text-muted-foreground">
            Explore and test your backend API endpoints
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open('http://127.0.0.1:8000/api/documentation', '_blank')}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in New Tab
        </Button>
      </div>

      <Tabs defaultValue="swagger">
        <TabsList className="mb-4">
          <TabsTrigger value="swagger">Swagger UI</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoint Reference</TabsTrigger>
          <TabsTrigger value="models">Data Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="swagger">
          <Card>
            <CardHeader>
              <CardTitle>Swagger Documentation</CardTitle>
              <CardDescription>
                Interactive API documentation powered by Swagger/OpenAPI
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <iframe 
                src="http://127.0.0.1:8000/api/documentation" 
                className="w-full h-[calc(100vh-350px)] border-0"
                title="Swagger UI"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints Reference</CardTitle>
              <CardDescription>
                Comprehensive list of all available API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Server className="mr-2 h-5 w-5 text-primary" />
                    Products API
                  </h3>
                  <div className="space-y-2">
                    <EndpointItem 
                      method="GET"
                      path="/api/products"
                      description="List all products with optional filtering"
                    />
                    <EndpointItem 
                      method="POST"
                      path="/api/products"
                      description="Create a new product"
                    />
                    <EndpointItem 
                      method="GET"
                      path="/api/products/{id}"
                      description="Get a specific product by ID"
                    />
                    <EndpointItem 
                      method="PUT"
                      path="/api/products/{id}"
                      description="Update a specific product"
                    />
                    <EndpointItem 
                      method="DELETE"
                      path="/api/products/{id}"
                      description="Delete a specific product"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Server className="mr-2 h-5 w-5 text-primary" />
                    Hotels API
                  </h3>
                  <div className="space-y-2">
                    <EndpointItem 
                      method="GET"
                      path="/api/hotels"
                      description="List all hotels with optional filtering"
                    />
                    <EndpointItem 
                      method="GET"
                      path="/api/hotels/{id}/rooms"
                      description="Get rooms for a specific hotel"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Server className="mr-2 h-5 w-5 text-primary" />
                    User Management API
                  </h3>
                  <div className="space-y-2">
                    <EndpointItem 
                      method="GET"
                      path="/api/users"
                      description="List all users (requires admin privileges)"
                    />
                    <EndpointItem 
                      method="POST"
                      path="/api/users"
                      description="Create a new user"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Data Models</CardTitle>
              <CardDescription>
                Schema definitions for API resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Database className="mr-2 h-5 w-5 text-primary" />
                    Product Model
                  </h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <pre className="text-xs md:text-sm overflow-auto p-2">
{`{
  "id": 1,
  "name": "Luxury Beach Resort",
  "type": "hotel",
  "description": "5-star luxury resort with private beach access",
  "price": 299.99,
  "is_active": true,
  "location": "Maldives",
  "image": null,
  "hotel_details": {
    "rooms": 2,
    "bathrooms": 2,
    "beds": 1,
    "amenities": ["pool", "spa", "restaurant", "wifi"],
    "stars": 5
  },
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Database className="mr-2 h-5 w-5 text-primary" />
                    User Model
                  </h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <pre className="text-xs md:text-sm overflow-auto p-2">
{`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": "2023-01-01T00:00:00.000000Z",
  "role": "admin",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type EndpointItemProps = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
};

function EndpointItem({ method, path, description }: EndpointItemProps) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'POST':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'PUT':
      case 'PATCH':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'DELETE':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-start border rounded-md p-3">
      <div className={`px-2 py-1 rounded font-mono text-xs font-medium ${getMethodColor(method)}`}>
        {method}
      </div>
      <div className="ml-3">
        <p className="font-mono text-sm">{path}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
