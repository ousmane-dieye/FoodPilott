import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Prediction Mock logic
  app.get("/api/predict-demand", (req, res) => {
    // Simple logic: demand is usually higher on Mondays/Tuesdays at 12:30
    const { day, hour } = req.query;
    let prediction = 250 + Math.floor(Math.random() * 50);
    
    if (day === 'Monday' || day === 'Tuesday') {
      prediction += 100;
    }
    
    const h = parseInt(hour as string);
    if (h >= 12 && h <= 13) {
      prediction += 150;
    }

    res.json({
      prediction,
      confidence: 0.85,
      suggestedPrepStartTime: "11:00 am"
    });
  });

  // Mock Payment Integration (Wave / Orange Money)
  app.post("/api/pay", (req, res) => {
    const { provider, amount, phone } = req.body;
    console.log(`Processing ${provider} payment of ${amount} for ${phone}`);
    // Simulate latency
    setTimeout(() => {
      res.json({
        success: true,
        transactionId: "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: "Paiement réussi"
      });
    }, 1000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
