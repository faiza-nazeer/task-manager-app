import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleTaskAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Task Manager</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList key={refresh} />
    </div>
  );
}

export default App;

