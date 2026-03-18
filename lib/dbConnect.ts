import mongoose from "mongoose";

type connectionProps = {
  isConnected?: number;
};

const connection: connectionProps = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "");
    console.log("ENV VALUE:", process.env.MONGODB_URL);
    connection.isConnected = db.connections[0].readyState;
    console.log(db);
    console.log(connection.isConnected);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);
    process.exit();
  }
}

export default dbConnect;
