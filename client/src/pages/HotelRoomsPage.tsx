import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash, MoreHorizontal, BedDouble, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DataTable } from '@/components/ui/data-table-a11y';
import { ColumnDef } from "@tanstack/react-table";
import { Hotel, Room } from "@/types/hotel";
import { getHotelById, getHotelRooms, createRoom, updateRoom, deleteRoom } from "@/services/hotelService";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function HotelRoomsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [roomData, setRoomData] = useState({
    room_number: "",
    type: "standard",
    price: "0",
    capacity: "1",
    description: "",
    is_available: true
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate("/dashboard/hotels");
        return;
      }

      try {
        setLoading(true);
        const hotelData = await getHotelById(parseInt(id));
        setHotel(hotelData);
        
        const roomsData = await getHotelRooms(parseInt(id));
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        toast({
          title: "Error",
          description: "Failed to load hotel rooms. Please try again.",
          variant: "destructive"
        });
        navigate("/dashboard/hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleAvailability = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData(prev => ({
      ...prev,
      is_available: e.target.checked
    }));
  };

  const resetForm = () => {
    setCurrentRoom(null);
    setRoomData({
      room_number: "",
      type: "standard",
      price: "0",
      capacity: "1",
      description: "",
      is_available: true
    });
  };

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setCurrentRoom(room);
      setRoomData({
        room_number: room.room_number || "",
        type: room.type || "standard",
        price: room.price ? room.price.toString() : "0",
        capacity: room.capacity ? room.capacity.toString() : "1",
        description: room.description || "",
        is_available: room.is_available ?? true
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);

      const roomPayload = {
        hotel_id: parseInt(id),
        room_number: roomData.room_number,
        type: roomData.type,
        price: parseFloat(roomData.price),
        capacity: parseInt(roomData.capacity),
        description: roomData.description,
        is_available: roomData.is_available
      };

      if (currentRoom) {
        // Update existing room
        await updateRoom(currentRoom.id, roomPayload);
        setRooms(prev => prev.map(room => 
          room.id === currentRoom.id ? { ...room, ...roomPayload, id: currentRoom.id } : room
        ));
        toast({
          title: "Success",
          description: "Room updated successfully!",
        });
      } else {
        // Create new room
        const newRoom = await createRoom(roomPayload);
        setRooms(prev => [...prev, newRoom]);
        toast({
          title: "Success",
          description: "Room added successfully!",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving room:", error);
      toast({
        title: "Error",
        description: "Failed to save room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId);
        setRooms(prev => prev.filter(room => room.id !== roomId));
        toast({
          title: "Success",
          description: "Room deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting room:", error);
        toast({
          title: "Error",
          description: "Failed to delete room. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Column definitions
  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "room_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <BedDouble className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.original.room_number}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => <div>{row.original.capacity} persons</div>,
    },
    {
      accessorKey: "is_available",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.is_available ? "success" : "destructive"}>
            {row.original.is_available ? "Available" : "Unavailable"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteRoom(row.original.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => {
    return (
      room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
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
          <h1 className="text-3xl font-bold">{hotel.name} - Rooms Management</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Rooms</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable 
            columns={columns} 
            data={filteredRooms} 
            ariaLabel="Hotel Rooms Table"
            searchKey="room_number"
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentRoom ? "Edit Room" : "Add New Room"}
            </DialogTitle>
            <DialogDescription>
              {currentRoom
                ? "Update the room details below."
                : "Fill in the details for the new room."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room_number" className="text-right">
                  Room Number
                </Label>
                <Input
                  id="room_number"
                  name="room_number"
                  value={roomData.room_number}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={roomData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={roomData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="10"
                  value={roomData.capacity}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={roomData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_available" className="text-right">
                  Available
                </Label>
                <div className="flex items-center col-span-3">
                  <input
                    type="checkbox"
                    id="is_available"
                    name="is_available"
                    checked={roomData.is_available}
                    onChange={handleToggleAvailability}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="is_available">
                    Room is available for booking
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
