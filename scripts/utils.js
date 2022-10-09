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
