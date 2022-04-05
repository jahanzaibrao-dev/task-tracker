import axios from "axios";
import { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const taskList = await axios.get("http://localhost:5000/tasks");

    setTasks(taskList.data);
  };

  const fetchTask = async (id) => {
    const response = await axios.get(`http://localhost:5000/tasks/${id}`);

    return response.data;
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);

    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleReminder = async (id) => {
    const task = await fetchTask(id);

    const updatedTask = { ...task, reminder: !task.reminder };

    const response = await axios.put(
      `http://localhost:5000/tasks/${id}`,
      updatedTask
    );

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: response.data.reminder } : task
      )
    );
  };

  const addTask = async (task) => {
    const response = await axios.post("http://localhost:5000/tasks", task);

    setTasks([...tasks, response.data]);
    // const id = Math.floor(Math.random() * 1000) + 1;
    // setTasks([...tasks, { id, ...task }]);
  };

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddForm(!showAddForm)}
          showAdd={showAddForm}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {showAddForm && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No Tasks To Show"
                )}
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
