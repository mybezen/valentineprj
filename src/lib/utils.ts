export const getRandomPosition = (
  containerWidth: number,
  containerHeight: number,
  elementSize: number,
  margin: number = 40
) => {
  return {
    x: margin + Math.random() * (containerWidth - elementSize - margin * 2),
    y: margin + Math.random() * (containerHeight - elementSize - margin * 2)
  };
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};