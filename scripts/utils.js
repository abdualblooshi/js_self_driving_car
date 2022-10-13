/*
    Author : @gitanimous
    Utilities
    - contains a collection of useful functions for use in the simulation.
*/

function lerp(A, B, t) {
  // Returns the linear interpolation between A and B at time t
  // Linear interpolation is a simple way to calculate a value between two values
  // based on a percentage. For example, if you want to calculate a value between
  // 0 and 100 at 50%, you would use lerp(0, 100, 0.5) which would return 50.
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  // Returns the intersection point between two lines
  // The lines are defined by the points A,B and C,D
  // The intersection point is returned as an object with the x and y coordinates
  // and the offset from point A. The offset is the distance along the line AB
  // from point A to the intersection point.
  // If the lines are parallel, the function returns null.

  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
