import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const statusColors: Record<T_TASK_STATUS, string> = {
  pending: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  failed: "bg-red-500",
  canceled: "bg-gray-500",
};
const EmailTaskList = ({ tasks }: { tasks: IEmailTask[] }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Email Tasks</CardTitle>
        <CardDescription>
          Manage your email tasks and track their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.email}</TableCell>
                <TableCell>{task.subject}</TableCell>
                <TableCell>{task.howMuchMessage}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[task.status as T_TASK_STATUS] +
                      " uppercase font-semibold"
                    }
                  >
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={task.status !== "pending"}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EmailTaskList;
