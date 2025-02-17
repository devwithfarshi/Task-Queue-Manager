import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddNewEmailTask from "./components/screens/AddNewEmailTask";
import EmailTaskList from "./components/screens/EmailLists";
import EmailTaskServices from "./services/EmailTaskServices";

const App = () => {
  const [tasks, setTasks] = useState<IEmailTask[]>([]);

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
