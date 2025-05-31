import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  UserPlus,
  Users,
  MapPin,
  Plane,
  Hotel,
  Package,
  Car,
  Tag,
  Download,
  Share2,
  MoreHorizontal,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock4
} from 'lucide-react';
import { format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

// Define event types
type EventType = 'flight' | 'hotel' | 'tour' | 'meeting' | 'deadline' | 'reminder';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  allDay: boolean;
  type: EventType;
  location?: string;
  participants?: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
  color?: string;
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Paris Flight Booking',
    description: 'Air France flight to Paris',
    startDate: '2025-06-05T08:30:00.000Z',
    endDate: '2025-06-05T11:45:00.000Z',
    allDay: false,
    type: 'flight',
    location: 'Paris, France',
    participants: ['John Doe', 'Jane Smith'],
    status: 'confirmed',
    color: '#4f46e5'
  },
  {
    id: '2',
    title: 'Luxury Resort Reservation',
    description: 'Beach resort booking for the Johnson family',
    startDate: '2025-06-10T14:00:00.000Z',
    endDate: '2025-06-17T12:00:00.000Z',
    allDay: true,
    type: 'hotel',
    location: 'Maldives',
    participants: ['Robert Johnson', 'Lisa Johnson', 'Mike Johnson'],
    status: 'confirmed',
    color: '#0ea5e9'
  },
  {
    id: '3',
    title: 'European Tour Package',
    description: 'Tour package covering Italy, France, and Spain',
    startDate: '2025-06-15T00:00:00.000Z',
    endDate: '2025-06-30T23:59:59.000Z',
    allDay: true,
    type: 'tour',
    location: 'Multiple',
    participants: ['Alice Williams', 'Bob Williams'],
    status: 'pending',
    color: '#22c55e'
  },
  {
    id: '4',
    title: 'Team Meeting',
    description: 'Monthly review of sales and bookings',
    startDate: '2025-06-03T10:00:00.000Z',
    endDate: '2025-06-03T11:30:00.000Z',
    allDay: false,
    type: 'meeting',
    location: 'Conference Room A',
    participants: ['All Sales Team', 'Manager'],
    status: 'confirmed',
    color: '#f59e0b'
  },
  {
    id: '5',
    title: 'Summer Campaign Deadline',
    description: 'Finalize all summer vacation packages',
    startDate: '2025-06-07T23:59:59.000Z',
    allDay: true,
    type: 'deadline',
    status: 'pending',
    color: '#ef4444'
  },
  {
    id: '6',
    title: 'Customer Follow-up',
    description: 'Call Mrs. Davis about her Tokyo trip',
    startDate: '2025-06-02T15:00:00.000Z',
    endDate: '2025-06-02T15:30:00.000Z',
    allDay: false,
    type: 'reminder',
    status: 'confirmed',
    color: '#8b5cf6'
  }
];

export function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  // Simulate API call to fetch events
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter events based on search query and filters
  useEffect(() => {
    let filtered = events;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }
    
    setFilteredEvents(filtered);
  }, [events, searchQuery, typeFilter, statusFilter]);

  // Get events for the current day
  const getDayEvents = (day: Date) => {
    return filteredEvents.filter(event => {
      const start = parseISO(event.startDate);
      const end = event.endDate ? parseISO(event.endDate) : start;
      
      return isSameDay(day, start) || 
             (event.endDate && day >= start && day <= end);
    });
  };

  // Get events for selected date
  const selectedDateEvents = getDayEvents(selectedDate);
  
  // Format time for display
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };
  
  // Get event color based on type
  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'flight': return 'bg-indigo-500';
      case 'hotel': return 'bg-sky-500';
      case 'tour': return 'bg-green-500';
      case 'meeting': return 'bg-amber-500';
      case 'deadline': return 'bg-red-500';
      case 'reminder': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get event icon based on type
  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'tour': return <Package className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'deadline': return <Clock4 className="h-4 w-4" />;
      case 'reminder': return <AlertCircle className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };
  
  // Get event status badge
  const getStatusBadge = (status: 'confirmed' | 'pending' | 'cancelled') => {
    switch (status) {
      case 'confirmed': 
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case 'pending': 
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      case 'cancelled': 
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default: 
        return null;
    }
  };

  // Navigate to previous period
  const goToPrevious = () => {
    if (view === 'month') {
      setDate(addMonths(date, -1));
    } else if (view === 'week') {
      setDate(addDays(date, -7));
    } else if (view === 'day') {
      setDate(addDays(date, -1));
    }
  };

  // Navigate to next period
  const goToNext = () => {
    if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'week') {
      setDate(addDays(date, 7));
    } else if (view === 'day') {
      setDate(addDays(date, 1));
    }
  };

  // Navigate to today
  const goToToday = () => {
    setDate(new Date());
    setSelectedDate(new Date());
  };

  // Open event details dialog
  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  // Render calendar with event indicators
  const renderCalendarWithEvents = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        month={date}
        onMonthChange={setDate}
        className="rounded-md border w-full"
        showOutsideDays={true}
        modifiers={{
          hasEvent: (date) => {
            return filteredEvents.some(event => {
              const eventStart = parseISO(event.startDate);
              const eventEnd = event.endDate ? parseISO(event.endDate) : eventStart;
              return (
                (isSameDay(date, eventStart) || 
                (event.endDate && date >= eventStart && date <= eventEnd))
              );
            });
          }
        }}
        modifiersClassNames={{
          hasEvent: 'relative before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-indigo-500'
        }}
        styles={{
          day: { height: '2.5rem' },
          caption: { display: 'none' } // Hide the built-in month title
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading calendar</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we process your request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Calendar</h2>
          <p className="text-muted-foreground">Manage your bookings, reservations, and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={goToPrevious}
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={goToToday}
          >
            Today
          </Button>
          <Button 
            variant="outline"
            onClick={goToNext}
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select 
            value={view} 
            onValueChange={(v) => setView(v as 'month' | 'week' | 'day' | 'agenda')}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-1" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event on the calendar. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Event description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="datetime-local" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="datetime-local" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select defaultValue="reminder">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="tour">Tour</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="pending">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input id="location" placeholder="Event location" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  Save Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input 
            placeholder="Search events..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={typeFilter} 
            onValueChange={(v) => setTypeFilter(v as EventType | 'all')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="flight">Flights</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="tour">Tours</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={statusFilter} 
            onValueChange={(v) => setStatusFilter(v as 'all' | 'confirmed' | 'pending' | 'cancelled')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar widget */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{format(date, 'MMMM yyyy')}</span>
                <div className="flex items-center gap-1 text-sm font-normal">
                  <Badge variant="outline" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                    {filteredEvents.length} Events
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-0">
                {renderCalendarWithEvents()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events for selected date */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-indigo-500" />
              <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length === 0 
                ? 'No events scheduled for this day' 
                : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {selectedDateEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No events found for this date</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try selecting a different date or adding a new event</p>
                  </div>
                ) : (
                  selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openEventDetails(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className={`h-10 w-10 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center text-white`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {event.allDay 
                                ? 'All day' 
                                : `${formatTime(event.startDate)} - ${event.endDate ? formatTime(event.endDate) : ''}`}
                            </p>
                            {event.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Event details dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full ${getEventTypeColor(selectedEvent.type)} flex items-center justify-center text-white`}>
                    {getEventTypeIcon(selectedEvent.type)}
                  </div>
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                </div>
                <DialogDescription className="flex items-center gap-2 pt-2">
                  {getStatusBadge(selectedEvent.status)}
                  <Badge variant="outline">
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Date & Time</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(parseISO(selectedEvent.startDate), 'MMMM d, yyyy')}
                      {selectedEvent.endDate && parseISO(selectedEvent.startDate).toDateString() !== parseISO(selectedEvent.endDate).toDateString() && 
                        ` - ${format(parseISO(selectedEvent.endDate), 'MMMM d, yyyy')}`
                      }
                    </span>
                  </div>
                  {!selectedEvent.allDay && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatTime(selectedEvent.startDate)}
                        {selectedEvent.endDate && ` - ${formatTime(selectedEvent.endDate)}`}
                      </span>
                    </div>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.location && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Location</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                )}
                
                {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Participants</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedEvent.participants.map((participant, index) => (
                        <Badge key={index} variant="secondary">{participant}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                <Button onClick={() => setIsEventDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
