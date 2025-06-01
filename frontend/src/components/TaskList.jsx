import { useEffect, useState } from "react";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  countTasks,
  countCompletedTasks,
} from "../api/taskService";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState(""); // why is this ""??
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [importance, setImportance] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }

      try {
        await fetchCount();
        console.log(taskCount);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      }
    };

    fetchData();
  }, []); // using the empty array [] tells react to run the code once after the component mounts. without

  const handleAdd = async () => {
    if (!newTitle.trim()) return; // guard clause to ignore empty input ie whitespace. prevents submitting an empty task
    const taskData = {
      title: newTitle,
      description: "", // or allow user input
      completed: false,
      importance,
    };
    try {
      const newTask = await addTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      setNewTitle("");
      fetchCount();
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
    fetchCount();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
    fetchCount();
  };

  const fetchCount = async () => {
    const total = await countTasks();
    const completed = await countCompletedTasks();
    setTaskCount(total);
    setCompletedCount(completed);
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column" mb={2}>
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          sx={{mb:2}}
        />

        <Box display="flex" gap={2}>
        <FormControl fullWidth sx={{ flex: 2 }}>
          <InputLabel id="importance-label">Importance</InputLabel>
          <Select
            labelId="importance-label"
            value={importance}
            label="Importance"
            onChange={(e) => setImportance(e.target.value)}
          >
            <MenuItem value={1}>Low</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>High</MenuItem>
          </Select>
        </FormControl>
        
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
        </Box>
      
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
  
  {task.importance === 2 && (
    <PriorityHighIcon sx={{ fontSize: 18, color: "orange" }} />
  )}

  {task.importance === 3 && (
    <Box display="flex" gap={0.25}>
      <PriorityHighIcon sx={{ fontSize: 18, color: "red" }} />
      <PriorityHighIcon sx={{ fontSize: 18, color: "red" }} />
    </Box>
  )}
            </ListItem>
          ))
        ) : (
          <ListItemText
            primary="You have no tasks yet. Add some above!"
            sx={{ justifyContent: "center" }}
          />
        )}
      </List>
      <Typography>
        Completed {completedCount} of {taskCount} tasks so far!
      </Typography>
    </Box>
  );
}
export default TaskList;
