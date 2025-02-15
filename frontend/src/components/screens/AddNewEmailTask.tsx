import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const emailTaskSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  howMuchMessage: z
    .number()
    .min(1, "Must send at least one message")
    .max(10, "Cannot send more than 10 messages"),
});

type EmailTaskFormValues = z.infer<typeof emailTaskSchema>;

const AddNewEmailTask = ({
  onSubmit,
}: {
  onSubmit: (formData: EmailTaskFormValues) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailTaskFormValues>({
    resolver: zodResolver(emailTaskSchema),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
      howMuchMessage: 1,
    },
  });

  const handleFormSubmit = async (data: EmailTaskFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to submit:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="w-4 h-4" /> Add Email Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Email Task</DialogTitle>
          <DialogDescription>
            Create a new email task by filling out the details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Your message here..."
              className="h-32"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="howMuchMessage">Number of Messages</Label>
            <Input
              id="howMuchMessage"
              type="number"
              min="1"
              max="100"
              {...register("howMuchMessage", { valueAsNumber: true })}
            />
            {errors.howMuchMessage && (
              <p className="text-red-500 text-sm">
                {errors.howMuchMessage.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewEmailTask;
