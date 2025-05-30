import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createHotel } from "@/services/hotelService";
import { Hotel } from "@/types/hotel";
import { useToast } from "@/components/ui/use-toast";
import { HotelForm } from "@/components/hotels/HotelForm";

export function CreateHotelPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<Hotel>) => {
    try {
      setIsSubmitting(true);
      await createHotel(data);
      toast({
        title: "Success",
        description: "Hotel created successfully!",
        variant: "success"
      });
      navigate("/dashboard/hotels");
    } catch (err) {
      console.error("Error creating hotel:", err);
      toast({
        title: "Error",
        description: "Failed to create hotel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            className="pl-0 mb-2"
            onClick={() => navigate("/dashboard/hotels")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
          <h1 className="text-3xl font-bold">Create New Hotel</h1>
        </div>
      </div>
      
      <Card className="p-6">
        <HotelForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </Card>
    </div>
  );
}
