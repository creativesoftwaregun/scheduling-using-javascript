import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, addHours } from "date-fns";
import { useCalendarStore } from "@/store/calendarStore";
import { CreateEventSchema, type CreateEventInput, type UpdateEventInput } from "@shared/types";
export function EventDialog() {
  const {
    isDialogOpen,
    closeDialog,
    selectedEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    categories,
  } = useCalendarStore();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const isEditMode = !!selectedEvent;
  const form = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      calendarId: "",
      start: new Date().toISOString(),
      end: addHours(new Date(), 1).toISOString(),
    },
  });
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, reset } = form;
  useEffect(() => {
    if (isDialogOpen) {
      if (selectedEvent) {
        reset({
          title: selectedEvent.title,
          description: selectedEvent.description || "",
          calendarId: selectedEvent.calendarId,
          start: selectedEvent.start,
          end: selectedEvent.end,
        });
      } else {
        reset({
          title: "",
          description: "",
          calendarId: categories.length > 0 ? categories[0].id : "",
          start: new Date().toISOString(),
          end: addHours(new Date(), 1).toISOString(),
        });
      }
    }
  }, [selectedEvent, isDialogOpen, categories, reset]);
  const startDate = watch("start") ? parseISO(watch("start")) : new Date();
  const endDate = watch("end") ? parseISO(watch("end")) : new Date();
  const onSubmit = async (data: CreateEventInput | UpdateEventInput) => {
    let success = false;
    if (isEditMode && selectedEvent) {
      const result = await updateEvent(selectedEvent.id, data);
      if (result) success = true;
    } else {
      const result = await createEvent(data as CreateEventInput);
      if (result) success = true;
    }
    if (success) {
      closeDialog();
    }
  };
  const handleDelete = async () => {
    if (selectedEvent) {
      const success = await deleteEvent(selectedEvent.id);
      if (success) {
        setDeleteAlertOpen(false);
        closeDialog();
      }
    }
  };
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[480px] bg-background">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{isEditMode ? "Edit Event" : "Create Event"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the details of your event." : "Add a new event to your calendar."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" placeholder="e.g., Team Meeting" {...register("title")} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Optional: Add notes or an agenda." {...register("description")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP, p")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={(day) => day && setValue("start", day.toISOString(), { shouldValidate: true })} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>End Date & Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, "PPP, p")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={(day) => day && setValue("end", day.toISOString(), { shouldValidate: true })} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.end && <p className="text-sm text-destructive">{errors.end.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="calendar">Calendar</Label>
              <Select onValueChange={(value) => setValue("calendarId", value)} value={watch("calendarId")}>
                <SelectTrigger id="calendar">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.calendarId && <p className="text-sm text-destructive">{errors.calendarId.message}</p>}
            </div>
            <DialogFooter className="flex-row justify-between items-center sm:justify-between">
              <div>
                {isEditMode && (
                  <Button type="button" variant="destructive" size="icon" onClick={() => setDeleteAlertOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete event</span>
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Create Event")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event from your calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}