import React, { useEffect, useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon, Package } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { generatePaymentDeadlineCalendarUrl } from "@/utils/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

function timeUntil(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days === 0) {
    if (hours <= 0) return "Due today";
    return `${hours}h left`;
  }
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

function getDeadlineStatus(deadline) {
  if (!deadline) return { status: "none", color: "muted" };
  const d = new Date(deadline);
  const now = new Date();
  const diff = d - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diff <= 0) return { status: "expired", color: "destructive" };
  if (days === 0 && hours <= 24) return { status: "urgent", color: "destructive" };
  if (days <= 1) return { status: "warning", color: "default" };
  return { status: "upcoming", color: "secondary" };
}

// Calendar grid component
function CalendarGrid({ deadlines, currentMonth, onDateClick, selectedDate }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get first day of month and number of days
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Create a map of dates with deadlines
  const deadlinesByDate = useMemo(() => {
    const map = {};
    deadlines.forEach(d => {
      const date = new Date(d.deadline);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(d);
    });
    return map;
  }, [deadlines]);
  
  // Check if a date has deadlines
  const getDeadlinesForDate = (year, month, day) => {
    const dateKey = `${year}-${month}-${day}`;
    return deadlinesByDate[dateKey] || [];
  };
  
  // Get status for a date
  const getDateStatus = (year, month, day) => {
    const dateDeadlines = getDeadlinesForDate(year, month, day);
    if (dateDeadlines.length === 0) return null;
    
    const now = new Date();
    const date = new Date(year, month, day);
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diff <= 0) return { status: "expired", color: "bg-red-500" };
    if (days === 0) return { status: "urgent", color: "bg-orange-500" };
    if (days <= 1) return { status: "warning", color: "bg-yellow-500" };
    return { status: "upcoming", color: "bg-blue-500" };
  };
  
  const today = new Date();
  const isToday = (year, month, day) => {
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };
  
  const isSelected = (year, month, day) => {
    if (!selectedDate) return false;
    return year === selectedDate.getFullYear() && 
           month === selectedDate.getMonth() && 
           day === selectedDate.getDate();
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  return (
    <div className="w-full">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const dateDeadlines = getDeadlinesForDate(
            currentMonth.getFullYear(), 
            currentMonth.getMonth(), 
            day
          );
          const status = getDateStatus(
            currentMonth.getFullYear(), 
            currentMonth.getMonth(), 
            day
          );
          const todayClass = isToday(
            currentMonth.getFullYear(), 
            currentMonth.getMonth(), 
            day
          ) ? "ring-2 ring-primary" : "";
          const selectedClass = isSelected(
            currentMonth.getFullYear(), 
            currentMonth.getMonth(), 
            day
          ) ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950" : "";
          
          return (
            <button
              key={day}
              onClick={() => onDateClick(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              className={`
                aspect-square rounded-md text-sm font-medium transition-all
                hover:bg-accent hover:text-accent-foreground
                ${todayClass}
                ${selectedClass}
                ${dateDeadlines.length > 0 ? "font-bold" : ""}
                ${status ? "text-white" : "text-foreground"}
                relative
              `}
              style={status ? { backgroundColor: status.color } : {}}
            >
              {day}
              {dateDeadlines.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className={`w-1 h-1 rounded-full ${status ? "bg-white" : status?.color || "bg-primary"}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DeadlinesCalendar() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarEmbedUrl, setCalendarEmbedUrl] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    let abort = false;
    async function fetchDeadlines() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/shop/order/deadlines/${user.id}`);
        const json = await res.json();
        if (!abort && json?.success) {
          setDeadlines(json.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch deadlines", e);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchDeadlines();
    return () => {
      abort = true;
    };
  }, [user?.id]);

  // Note: Google Calendar OAuth requires app verification which is blocking access
  // Using iCal feed subscription method instead (works without OAuth)
  useEffect(() => {
    setCalendarLoading(false);
    setCalendarEmbedUrl(null);
    setNeedsAuth(false);
  }, [user?.id]);

  // Filter deadlines - show all pending orders with deadlines (including expired for calendar display)
  const activeDeadlines = useMemo(() => {
    return deadlines.filter(d => {
      // Show all pending orders with deadlines, even if expired (for calendar visibility)
      return d.deadline && d.status === "pending";
    });
  }, [deadlines]);
  
  // Get only upcoming (non-expired) deadlines for badge count
  const upcomingDeadlines = useMemo(() => {
    return activeDeadlines.filter(d => {
      const deadlineDate = new Date(d.deadline);
      const now = new Date();
      return deadlineDate > now;
    });
  }, [activeDeadlines]);

  // Group deadlines by date
  const groupedDeadlines = useMemo(() => {
    const groups = {};
    activeDeadlines.forEach(d => {
      const dateKey = new Date(d.deadline).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(d);
    });
    return groups;
  }, [activeDeadlines]);

  // Get deadlines for selected date
  const selectedDateDeadlines = useMemo(() => {
    if (!selectedDate) return [];
    return activeDeadlines.filter(d => {
      const deadlineDate = new Date(d.deadline);
      // Compare dates by year, month, and day only (ignore time)
      return deadlineDate.getFullYear() === selectedDate.getFullYear() &&
             deadlineDate.getMonth() === selectedDate.getMonth() &&
             deadlineDate.getDate() === selectedDate.getDate();
    });
  }, [selectedDate, activeDeadlines]);

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };


  return (
    <TooltipProvider>
      <DropdownMenu open={calendarOpen} onOpenChange={setCalendarOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative bg-secondary hover:bg-accent border-secondary text-foreground"
              >
                <CalendarIcon className="w-6 h-6" />
                {upcomingDeadlines.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                    {upcomingDeadlines.length > 9 ? "9+" : upcomingDeadlines.length}
                  </Badge>
                )}
                <span className="sr-only">Payment Deadlines</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Payment Deadlines ({upcomingDeadlines.length} upcoming)</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="bottom" align="end" className="w-[800px] max-h-[700px] overflow-hidden flex flex-col p-0 bg-white dark:bg-gray-900">
          {/* Google Calendar-style Header */}
          <div className="px-4 py-3 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Payment Deadlines</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">BukSu EEU</p>
                </div>
              </div>
            </div>
            {upcomingDeadlines.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {upcomingDeadlines.length} upcoming
              </Badge>
            )}
          </div>
          
          {/* Google Calendar Embed */}
          <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
            {calendarLoading || loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground">Loading Google Calendar...</div>
              </div>
            ) : !calendarEmbedUrl ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <CalendarIcon className="h-16 w-16 mx-auto text-blue-500 mb-6" />
                <div className="space-y-3 w-full max-w-sm">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const calendarFeedUrl = `http://localhost:5000/api/shop/order/calendar/${user.id}/feed.ics`;
                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(calendarFeedUrl)}`;
                      window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Open in Google Calendar
                  </Button>
                </div>
              </div>
            ) : calendarEmbedUrl && user?.id ? (
              <iframe
                src={calendarEmbedUrl}
                style={{
                  border: 0,
                  width: '100%',
                  height: '100%',
                  minHeight: '600px',
                }}
                frameBorder="0"
                scrolling="no"
                title="Google Calendar - Payment Deadlines"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Please log in to view your calendar</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-white dark:bg-gray-900">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                navigate("/shop/account?tab=orders");
                setCalendarOpen(false);
              }}
            >
              <Package className="h-3 w-3 mr-1" />
              View All Orders
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
