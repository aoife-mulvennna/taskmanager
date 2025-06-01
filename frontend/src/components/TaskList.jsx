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
import Checkbox from "@mui/material/Checkbox";

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

  const handleComplete = async (task) => {
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

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
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
      <List sx={{ mt: 2 }}>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Checkbox
                checked={task.completed} // uses the variable (it is checked if completed = true)
                onChange={() => handleComplete(task)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <ListItemText
                primary={task?.title ?? "Untitled"}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              />
            </ListItem>
          ))) : (<ListItemText primary="You have no tasks yet. Add some above!" sx={{justifyContent:"center"}} /> )
        }
      </List>
      
    </Box>
  );
}
export default TaskList;
