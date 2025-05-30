import { useState, useEffect } from "react";
import { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type HotelFormProps = {
  hotel?: Hotel;
  onSubmit: (data: Partial<Hotel>) => void;
  isSubmitting: boolean;
};

export function HotelForm({ hotel, onSubmit, isSubmitting }: HotelFormProps) {
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: "",
    description: "",
    location: "",
    stars: 3,
    price_per_night: 0,
    amenities: [],
    check_in_time: "",
    check_out_time: "",
    contact_email: "",
    contact_phone: "",
    cancellation_policy: "",
    is_active: true
  });
  
  const [amenity, setAmenity] = useState("");

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        location: hotel.location || "",
        stars: hotel.stars || 3,
        price_per_night: hotel.price_per_night || 0,
        amenities: hotel.amenities || [],
        check_in_time: hotel.check_in_time || "",
        check_out_time: hotel.check_out_time || "",
        contact_email: hotel.contact_email || "",
        contact_phone: hotel.contact_phone || "",
        cancellation_policy: hotel.cancellation_policy || "",
        is_active: hotel.is_active !== undefined ? hotel.is_active : true
      });
    }
  }, [hotel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddAmenity = () => {
    if (amenity.trim() && !formData.amenities?.includes(amenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenity.trim()]
      }));
      setAmenity("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hotel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stars">Rating (Stars)</Label>
            <Select
              value={formData.stars?.toString()}
              onValueChange={(value) => handleSelectChange("stars", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_per_night">Price Per Night ($)</Label>
            <Input
              id="price_per_night"
              name="price_per_night"
              type="number"
              min="0"
              step="0.01"
              value={formData.price_per_night}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check_in_time">Check-in Time</Label>
            <Input
              id="check_in_time"
              name="check_in_time"
              value={formData.check_in_time}
              onChange={handleInputChange}
              placeholder="e.g., 3:00 PM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check_out_time">Check-out Time</Label>
            <Input
              id="check_out_time"
              name="check_out_time"
              value={formData.check_out_time}
              onChange={handleInputChange}
              placeholder="e.g., 11:00 AM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
            <Textarea
              id="cancellation_policy"
              name="cancellation_policy"
              rows={2}
              value={formData.cancellation_policy}
              onChange={handleInputChange}
              placeholder="e.g., Free cancellation up to 24 hours before check-in"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                {formData.is_active ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section - Full Width */}
      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="Add an amenity (e.g., Free WiFi)"
            value={amenity}
            onChange={(e) => setAmenity(e.target.value)}
            className="flex-grow"
          />
          <Button type="button" onClick={handleAddAmenity}>
            Add
          </Button>
        </div>
        {formData.amenities && formData.amenities.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="ml-2 text-sm hover:text-destructive"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">No amenities added yet.</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (hotel ? "Update Hotel" : "Create Hotel")}
        </Button>
      </div>
    </form>
  );
}
