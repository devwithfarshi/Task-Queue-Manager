import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import AddNewEmailTask from "./components/screens/AddNewEmailTask";
import EmailTaskList from "./components/screens/EmailLists";
import useAuth from "./hooks/use-auth";
import EmailTaskServices from "./services/EmailTaskServices";
const App = () => {
  const [_, setSocket] = useState<Socket | null>(null);

  const [tasks, setTasks] = useState<IEmailTask[]>([]);
  const { user } = useAuth();

  const handleSubmit = async (formData: IEmailTask) => {
    try {
      const response = await EmailTaskServices.createEmailTask(formData);
      if (response.success) {
        toast.success(response.message);
        setTasks((prev) => [response.data, ...prev]);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.log(`Error while create task: `, error);
      toast.error(
        error.response.data.message ||
          error.message ||
          "Email Task create failed."
      );
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await EmailTaskServices.getAllEmailTask();
        if (response.success) {
          setTasks(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`);

    newSocket.on("connect", () => {
      console.log(`Connected to socket server`);
      newSocket.emit("authenticate", user?._id);
    });

    newSocket.on("task-status-update", (data) => {
      setTasks((prev) => {
        return prev.map((task) => {
          if (task._id === data.taskId) {
            return { ...task, status: data.status };
          }
          return task;
        });
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Email Task Manager</h1>
            <p className="text-gray-400">Manage and track your email tasks</p>
          </div>
          <AddNewEmailTask onSubmit={handleSubmit} />
        </div>
        <EmailTaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default App;
