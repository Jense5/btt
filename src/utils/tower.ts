import { v4 } from "uuid";

type SignalMap = {
  [peripheralId: string]: {
    signal: number;
  };
};

type Tower = {
  id: string;
  signals: SignalMap;
  coordinate: { x: number; y: number };
};

type CreateTowerParams = { x: number; y: number };

let towers: Tower[] = [];

export const getTowers = () => towers;

export const areValidCreateTowerParams = (params: CreateTowerParams) => {
  return (
    params.x !== undefined &&
    params.y !== undefined &&
    typeof params.x === "number" &&
    typeof params.y === "number" &&
    !isNaN(params.x) &&
    !isNaN(params.y)
  );
};

export const createTower = (params: CreateTowerParams) => {
  if (!areValidCreateTowerParams(params)) {
    throw new Error("invalid params");
  }
  const tower = {
    id: v4(),
    signals: {},
    coordinate: {
      x: params.x,
      y: params.y,
    },
  };
  towers.push(tower);
  return tower;
};

export const getTower = (id: string) => {
  return towers.find((t) => t.id === id);
};

export const setSignals = (towerId: string, signals: SignalMap) => {
  const tower = towers.find((t) => t.id === towerId);
  if (tower) {
    tower.signals = signals;
  }
  return tower;
};

export const deleteTower = (id: string) => {
  towers = towers.filter((t) => t.id !== id);
};

export const deleteAllTowers = () => {
  towers = [];
};
