const express = require('express');
const cors = require('cors');
const app = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use('/images', express.static('images'));
app.use('/pdfs', express.static('pdfs'));

// routes
const userRoute = require("./routes/user.route");
const patientRoute = require('./routes/patient.route');
const apptRoute = require('./routes/appointment.route');
const categoryRoute = require('./routes/category/category.route');
const subCategoryRoute = require('./routes/category/sub_category.route');
const testNameRoute = require('./routes/category/test_name.route');
const invRoute = require('./routes/inoive.route');
const testRoute = require('./routes/test.route');
const expenseRoute = require('./routes/expense.route');
const bedRoute = require('./routes/bed.route');
const pcRoute = require('./routes/pc.route');
const verifyToken = require('./middlewares/verifyToken');
const dashboard = require('./utils/dashboard');

app.get('/api/v1/dashboard', verifyToken, dashboard)

app.get("/", (req, res) => {
    res.send("Hello from HMS server! Powered by UNIECH")
})

app.use("/api/v1/user", userRoute);
app.use("/api/v1/patient", patientRoute);
app.use("/api/v1/appointment", apptRoute);
app.use("/api/v1/invoice", invRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/sub_category", subCategoryRoute);
app.use("/api/v1/test_name", testNameRoute);
app.use('/api/v1/test', testRoute);
app.use('/api/v1/expense', expenseRoute);
app.use('/api/v1/bed', bedRoute);
app.use('/api/v1/pc', pcRoute);

module.exports = app