import { Request, Response, Router } from "express";
import { createTower, deleteTower, getTower, setSignals } from "../utils/tower";

export const router = Router();

router.post("/", (req: Request, res: Response) => {
  try {
    const tower = createTower({
      x: parseInt(req.body.x, 10),
      y: parseInt(req.body.y, 10),
    });
    res.json({ tower });
  } catch (exc) {
    console.log(exc);
    res.status(400).json({
      error: "invalid params to create tower",
    });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  const tower = getTower(req.params.id);
  res.json({ tower });
});

router.put("/:id", (req: Request, res: Response) => {
  const tower = setSignals(req.params.id, req.body);
  res.json({ tower });
});

router.delete("/:id", (req: Request, res: Response) => {
  deleteTower(req.params.id);
  res.json({ tower: null });
});
