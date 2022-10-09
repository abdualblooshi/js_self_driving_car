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
  // Returns the intersection point between two lines AB and CD
  // The intersection point is the point where the two lines intersect.
  // If the lines are parallel, then the function returns null.
  const denominator = (A.x - B.x) * (C.y - D.y) - (A.y - B.y) * (C.x - D.x);
  if (denominator == 0) {
    return null;
  }
  const x =
    ((A.x * B.y - A.y * B.x) * (C.x - D.x) -
      (A.x - B.x) * (C.x * D.y - C.y * D.x)) /
    denominator;
  const y =
    ((A.x * B.y - A.y * B.x) * (C.y - D.y) -
      (A.y - B.y) * (C.x * D.y - C.y * D.x)) /
    denominator;
  return { x, y };
}
