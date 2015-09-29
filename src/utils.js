export function map(value, sourceMin, sourceMax, destMin, destMax) {
  return (destMax - destMin) *
    ((value - sourceMin) / (sourceMax - sourceMin)) + destMin;
};
