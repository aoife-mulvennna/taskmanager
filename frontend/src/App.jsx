import TaskList from "./components/TaskList";
import { Container, Typography, Paper, Box } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
       <Box
        sx={{
          width: "100%",
          px: 2,
          maxWidth: 480,
        }}
      >
      <Paper elevation={3} sx={{ padding: 4, width: "100%"}}>
      <Typography variant="h4" align="center" gutterBottom>
            📝 Task Manager
          </Typography>
          <TaskList />
        </Paper>
        </Box>
    </Box>
  );
}

export default App;
