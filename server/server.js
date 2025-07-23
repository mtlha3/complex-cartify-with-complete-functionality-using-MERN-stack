// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./db/config.js";
// import authRoutes from "./routes/authRoutes.js";
// import CauthRoutes from "./routes/CauthRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = ["http://localhost:5173", "https://cartify-server-c09ra1uil-muhammad-talhas-projects-a3a7b800.vercel.app"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// app.use("/api/auth", authRoutes);
// app.use("/auth", CauthRoutes);
// app.use("/product", productRoutes);
// app.use("/cart", cartRoutes);
// app.use("/order", orderRoutes);

// connectDB();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/config.js";
import authRoutes from "./routes/authRoutes.js";
import CauthRoutes from "./routes/CauthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/auth", CauthRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
