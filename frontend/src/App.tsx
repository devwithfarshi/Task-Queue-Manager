import { useState } from "react";
import EmailTaskList from "./components/screens/EmailLists";
import AddNewEmailTask from "./components/screens/AddNewEmailTask";

const App = () => {
  const [tasks, setTasks] = useState<IEmailTask[]>([
    {
      _id: "1",
      email: "test@example.com",
      subject: "Test Email",
      message: "Hello World",
      howMuchMessage: 2,
      status: "pending",
    },
  ]);

  const handleSubmit = async (formData: IEmailTask) => {
    setTasks([
      ...tasks,
      {
        _id: Date.now().toString(),
        ...formData,
        status: "pending",
      },
    ]);
  };

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
