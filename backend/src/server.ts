import "dotenv/config";

import app from "./app.js";
import { processAutomaticOrders } from "./workers/orderProgression.worker.js";
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server live at ${PORT}`);
});

// worker - process orders
setInterval(() => {
  processAutomaticOrders().catch((error) => {
    console.error("Automatic order progression failed:", error);
  });
}, 5000);
