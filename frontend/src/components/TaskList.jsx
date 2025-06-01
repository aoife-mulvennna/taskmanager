import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../api/taskService";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState(""); // why is this ""??

  useEffect(() => {
    getTasks()
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      });
  }, []); // using the empty array [] tells react to run the code once after the component mounts. without 

  const handleAdd = async () => {
    if (!newTitle.trim()) return; // guard clause to ignore empty input ie whitespace. prevents submitting an empty task
    const taskData = {
      title: newTitle,
      description: "", // or allow user input
      completed: false,
    };
    try {
      const newTask = await addTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleToggle = async (task) => {
    const updated = await updateTask(task.id, {
      ...task,
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={2} >
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Box>
      <List sx={{mt:2}}>
        {Array.isArray(tasks) &&
          tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                  <DeleteIcon />
                </IconButton>
              }
              button
              onClick={() => handleToggle(task)}
            >
              <ListItemText
                primary={task?.title ?? "Untitled"}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
}
export default TaskList;
