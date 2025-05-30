import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, BedDouble } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel } from "@/types/hotel";
import { getHotelById, deleteHotel } from "@/services/hotelService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Component to display star rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      <span className="ml-1 text-sm">({rating})</span>
    </div>
  );
};

export function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getHotelById(parseInt(id));
        setHotel(data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
        toast({
          title: "Error",
          description: "Failed to load hotel details. Please try again.",
          variant: "destructive"
        });
        navigate("/dashboard/hotels");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotel();
  }, [id, navigate, toast]);

  const handleEdit = () => {
    if (hotel) {
      navigate(`/dashboard/hotels/${hotel.id}/edit`);
    }
  };

  const handleViewRooms = () => {
    if (hotel) {
      navigate(`/dashboard/hotels/${hotel.id}/rooms`);
    }
  };

  const handleDelete = async () => {
    if (!hotel) return;

    if (window.confirm(`Are you sure you want to delete ${hotel.name}?`)) {
      try {
        setIsDeleting(true);
        await deleteHotel(hotel.id);
        toast({
          title: "Success",
          description: `${hotel.name} has been deleted.`,
          variant: "success"
        });
        navigate("/dashboard/hotels");
      } catch (error) {
        console.error("Error deleting hotel:", error);
        toast({
          title: "Error",
          description: "Failed to delete hotel. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hotel Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The hotel you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/dashboard/hotels")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => navigate("/dashboard/hotels")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hotels
        </Button>
        {user && (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleViewRooms}>
              <BedDouble className="mr-2 h-4 w-4" />
              Manage Rooms
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-1">{hotel.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={hotel.stars} />
                    <Badge variant={hotel.is_active ? "success" : "destructive"}>
                      {hotel.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${hotel.price_per_night} <span className="text-sm font-normal text-muted-foreground">/ night</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{hotel.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <p className="text-muted-foreground">{hotel.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Contact</h3>
                    <p className="text-muted-foreground">{hotel.contact_email || "No email provided"}</p>
                    <p className="text-muted-foreground">{hotel.contact_phone || "No phone provided"}</p>
                  </div>
                </TabsContent>
                <TabsContent value="amenities" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Property Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {hotel.amenities && hotel.amenities.length > 0 ? (
                        hotel.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span>{amenity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No amenities listed</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="policies" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Check-in/Check-out</h3>
                    <p className="text-muted-foreground">
                      Check-in: {hotel.check_in_time || "Standard check-in time"}
                    </p>
                    <p className="text-muted-foreground">
                      Check-out: {hotel.check_out_time || "Standard check-out time"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Cancellation Policy</h3>
                    <p className="text-muted-foreground">
                      {hotel.cancellation_policy || "Contact hotel for cancellation policy details."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rooms Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Rooms</span>
                  <Badge variant="outline" className="text-sm">
                    {Array.isArray(hotel.rooms) ? hotel.rooms.length : (hotel.rooms_count || 0)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available Types</span>
                  <Badge variant="outline" className="text-sm">
                    {Array.isArray(hotel.rooms) 
                      ? new Set(hotel.rooms.map(room => room.type)).size
                      : "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Price Range</span>
                  <Badge variant="outline" className="text-sm">
                    {Array.isArray(hotel.rooms) && hotel.rooms.length > 0
                      ? `$${Math.min(...hotel.rooms.map(room => room.price))} - $${Math.max(...hotel.rooms.map(room => room.price))}`
                      : "N/A"}
                  </Badge>
                </div>
                <Button 
                  onClick={handleViewRooms} 
                  className="w-full mt-4"
                >
                  <BedDouble className="mr-2 h-4 w-4" />
                  View All Rooms
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hotel Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Created</span>
                  <span className="text-sm text-muted-foreground">
                    {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {hotel.updated_at ? new Date(hotel.updated_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ID</span>
                  <Badge variant="outline" className="text-sm">
                    {hotel.id}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
