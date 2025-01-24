// app.js

//Configuración inicial
const express = require("express");
const cors = require("cors");

const app = express();
// Configuración del middleware
app.use(express.json());

// Permitir el origen específico para el entorno de desarrollo
app.use(
  cors({
    origin: "https://capstone-juan-vue.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//Para todas
app.use(cors());

//Rutas
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const rolRoutes = require("./routes/rolRoutes");
const paymentStateRoutes = require("./routes/paymentStateRoutes");
const paymentTypeRoutes = require("./routes/paymentTypeRoutes");
const priorityRoutes = require("./routes/priorityRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const requestStateRoutes = require("./routes/requestStateRoutes");
const requestRoutes = require("./routes/requestRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const unitRoutes = require("./routes/unitRoutes");
const stepsRoutes = require("./routes/stepsRoutes");
const productRecipeRoutes = require("./routes/productRecipeRoutes");
const likeRoutes = require("./routes/likeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");
const requestTypeRoutes = require("./routes/requestTypeRoutes.js");
const statisticsRoutes = require("./routes/statisticsRoutes.js");
const recommendationRoutes = require("./routes/recommendationRoutes.js");

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", rolRoutes);
app.use("/api", paymentStateRoutes);
app.use("/api", paymentTypeRoutes);
app.use("/api", priorityRoutes);
app.use("/api", recipeRoutes);
app.use("/api", requestStateRoutes);
app.use("/api", requestRoutes);
app.use("/api", unitRoutes);
app.use("/api", stepsRoutes);
app.use("/api", productRecipeRoutes);
app.use("/api", likeRoutes);
app.use("/api", categoryRoutes);
app.use("/api", imageRoutes);
app.use("/api", requestTypeRoutes);
app.use("/api", cartRoutes);
app.use("/api", statisticsRoutes);
app.use("/api", recommendationRoutes);

//http://localhost:3000/api/users

//Lanzamiento del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
