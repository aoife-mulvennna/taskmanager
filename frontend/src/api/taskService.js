const API_URL = "http://localhost:8080/api/tasks";

async function handleResponse(res) {
    if (!res.ok){
        const err = await res.text()
        throw new Error(`API error ${res.status}: ${err}`);
    }
    return res.json(); 
}

export async function getTasks() {
  const res = await fetch(API_URL);
  return handleResponse(res)
}

export async function addTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok){
    throw new Error("Failed to add task")
  }
  return handleResponse(res)
}

export async function updateTask(id, updatedTask) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });
  return handleResponse(res)
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
