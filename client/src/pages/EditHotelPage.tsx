import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHotelById, updateHotel } from "@/services/hotelService";
import { Hotel } from "@/types/hotel";
import { useToast } from "@/components/ui/use-toast";
import { HotelForm } from "@/components/hotels/HotelForm";

export function EditHotelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) {
        navigate("/dashboard/hotels");
        return;
      }

      try {
        setIsLoading(true);
        const data = await getHotelById(parseInt(id));
        setHotel(data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
        toast({
          title: "Error",
          description: "Failed to load hotel data. Please try again.",
          variant: "destructive"
        });
        navigate("/dashboard/hotels");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotel();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: Partial<Hotel>) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await updateHotel(parseInt(id), data);
      toast({
        title: "Success",
        description: "Hotel updated successfully!",
        variant: "success"
      });
      navigate(`/dashboard/hotels/${id}`);
    } catch (err) {
      console.error("Error updating hotel:", err);
      toast({
        title: "Error",
        description: "Failed to update hotel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
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
            The hotel you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/dashboard/hotels")}>
            Back to Hotels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            className="pl-0 mb-2"
            onClick={() => navigate(`/dashboard/hotels/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotel Details
          </Button>
          <h1 className="text-3xl font-bold">Edit Hotel: {hotel.name}</h1>
        </div>
      </div>
      
      <Card className="p-6">
        <HotelForm 
          hotel={hotel} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </Card>
    </div>
  );
}
