const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs")

const app = express();
const PORT = 8000;

// Middleware - Plugin

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Route
app.get("/users", (req, res) => {
  const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Dynamic path parameters
// app.get("/api/users/:id", (req, res) =>{
//     const id = Number(req.params.id);
//     const user =users.find((user) => user.id === id);
//     return res.json(user)
// })

app.post("/api/users", (req, res) => {
  // TODO: Create new user
  const body = req.body;
  console.log("BODY", body);
  users.push({...body, id: users.length +1});
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
    return res.json({ status: "success", id: users.length  });
  })
});

app.route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  })
  .put((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    // Find the index of the user
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    users[userIndex] = { ...users[userIndex], ...body };

    // Save updated users list to file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user data" });
      }
      return res.json({ status: "success", user: users[userIndex] });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);

    // Find the index of the user
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove user from the array
    const deletedUser = users.splice(userIndex, 1);

    // Save updated users list to file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete user data" });
      }
      return res.json({ status: "success", deletedUser });
    });
  });




app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
