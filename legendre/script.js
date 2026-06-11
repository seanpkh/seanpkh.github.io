"use strict";

const parameterCanvas = document.querySelector("#parameter-plane");
const periodCanvas = document.querySelector("#period-plane");
const resetButton = document.querySelector("#reset-button");
const tReadout = document.querySelector("#t-readout");
const periodOneReadout = document.querySelector("#period-one");
const periodTwoReadout = document.querySelector("#period-two");
const dynamicPeriodUpdatesToggle = document.querySelector("#dynamic-period-updates");

const colors = {
  ink: "#172033",
  muted: "#667085",
  grid: "#e8edf5",
  axis: "#97a3b6",
  teal: "#007a78",
  sharedCut: "#2f8b78",
  orange: "#c35f2e",
  rose: "#c43a5f",
  violet: "#5d55a6",
  panel: "#fbfcff",
};

const xView = {
  xmin: -1.9,
  xmax: 3.55,
  ymin: -1.8,
  ymax: 2.8,
};

const initialT = c(2, 0);
const contourStart = c(3, 0);
const leftBranch = c(0, 0);
const rightBranch = c(1, 0);
const criticalPoints = [leftBranch, rightBranch];
const sourceField = {
  radius: 0.085,
  clearance: 0.028,
  strength: 5.2,
};
const pointPush = {
  repulsionPasses: 3,
  branchStrength: 9,
  branchRadius: 0.17,
  branchClearance: 0.034,
  packageTCutClearance: 0.068,
  packageContourClearance: 0.07,
  tCutRadius: 0.13,
  tCutClearance: 0.046,
  contourOneClearance: 0.023,
  obstacleFeather: 0.08,
};
const protectedZone = {
  radius: 0.145,
  lockRadius: 0.19,
  color: "rgba(195, 95, 46, 0.11)",
  stroke: "rgba(195, 95, 46, 0.42)",
};
const traceInteraction = {
  activeAfterDistance: 2,
  packageActiveAfterDistance: 0.55,
};
const sharedStartLock = {
  radius: 0.13,
};
const branchTube = {
  halfWidth: 0.045,
  capRadius: 0.07,
  capSegments: 16,
  centerCullTolerance: 0.0025,
  centerCullMaxSegment: 0.052,
};
const periodIntegration = {
  redCutSideOffset: 0.014,
  redCutMaxSegment: 0.018,
  redCutMaxPoints: 650,
  quadratureStep: 0.024,
  singularNeighborhood: 0.08,
};
const contourMesh = {
  branchCutInitialCount: 360,
  branchCutMaxSegment: 0.016,
  branchCutMaxPoints: 1000,
  branchCutCullTolerance: 0.003,
  branchCutCullMaxSegment: 0.1,
  contourOneMaxSegment: 0.032,
  contourOneMaxPoints: 1000,
  contourOneCullTolerance: 0.0045,
  contourOneCullMaxSegment: 0.18,
  tCutCullTolerance: 0.0035,
  tCutCullMaxSegment: 0.15,
  smoothPasses: 2,
  smoothWeight: 0.22,
};
const dragConstraint = {
  step: 0.045,
  maxSteps: 32,
};

const state = {
  t: clone(initialT),
  dragging: false,
  hoverHandle: false,
  branch01: [],
  branch01Locked: [],
  tCut: [],
  tCutLocked: [],
  contourOne: [],
  contourOneLocked: [],
  contourTwo: [],
  contourTwoLocked: [],
  referencePeriods: [c(0, 0), c(0, 0)],
  periodLimit: 5,
  periods: [c(0, 0), c(0, 0)],
  dynamicPeriodUpdates: true,
  periodUpdatePending: false,
  pendingDragTarget: null,
  dragFrame: null,
};

function c(re, im) {
  return { re, im };
}

function clone(z) {
  return c(z.re, z.im);
}

function clonePath(points) {
  return points.map(clone);
}

function add(a, b) {
  return c(a.re + b.re, a.im + b.im);
}

function sub(a, b) {
  return c(a.re - b.re, a.im - b.im);
}

function scale(z, k) {
  return c(z.re * k, z.im * k);
}

function dot(a, b) {
  return a.re * b.re + a.im * b.im;
}

function cross(a, b) {
  return a.re * b.im - a.im * b.re;
}

function lerp(a, b, u) {
  return c(a.re + (b.re - a.re) * u, a.im + (b.im - a.im) * u);
}

function mul(a, b) {
  return c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}

function reciprocal(z) {
  const denominator = z.re * z.re + z.im * z.im;
  if (denominator < 1e-14) {
    return c(0, 0);
  }
  return c(z.re / denominator, -z.im / denominator);
}

function neg(z) {
  return c(-z.re, -z.im);
}

function abs(z) {
  return Math.hypot(z.re, z.im);
}

function distance(a, b) {
  return abs(sub(a, b));
}

function normalize(z, fallback = c(1, 0)) {
  const length = abs(z);
  return length > 0.000001 ? scale(z, 1 / length) : fallback;
}

function complexSqrt(z) {
  const r = Math.hypot(z.re, z.im);
  if (r === 0) {
    return c(0, 0);
  }
  const re = Math.sqrt((r + z.re) / 2);
  const im = Math.sign(z.im || 1) * Math.sqrt(Math.max(0, (r - z.re) / 2));
  return c(re, im);
}

function rayEndpointFor(point) {
  return c(
    Math.max(xView.xmax + 12, point.re + 12),
    point.im + 0.137 + 0.021 * Math.sin(point.re * 12.989 + point.im * 78.233),
  );
}

function rayCutIntersectionCount(point, rayEnd, cut) {
  let count = 0;
  for (let i = 0; i < cut.length - 1; i += 1) {
    if (segmentIntersection(point, rayEnd, cut[i], cut[i + 1])) {
      count += 1;
    }
  }
  return count;
}

function rayExtendedCutIntersectionCount(point, rayEnd, cut, farX) {
  let count = rayCutIntersectionCount(point, rayEnd, cut);
  if (cut.length === 0) {
    return count;
  }

  const last = cut[cut.length - 1];
  if (last.re < farX - 0.01) {
    count += segmentIntersection(point, rayEnd, last, c(farX, last.im)) ? 1 : 0;
  }
  return count;
}

function segmentIntersectionCount(point, rayEnd, a, b) {
  return segmentIntersection(point, rayEnd, a, b) ? 1 : 0;
}

function cutDifferenceParity(desiredCount, defaultCount) {
  return (
    desiredCount
    + defaultCount
  ) % 2;
}

function globalSquareRoot(x, t) {
  const sqrt01 = mul(complexSqrt(x), complexSqrt(sub(x, rightBranch)));
  const sqrtT = mul(c(0, 1), complexSqrt(sub(t, x)));
  let root = mul(sqrt01, sqrtT);

  const rayEnd = rayEndpointFor(x);
  const farX = rayEnd.re;
  const purpleParity = cutDifferenceParity(
    rayCutIntersectionCount(x, rayEnd, state.branch01),
    segmentIntersectionCount(x, rayEnd, leftBranch, rightBranch),
  );
  const redParity = cutDifferenceParity(
    rayExtendedCutIntersectionCount(x, rayEnd, state.tCut, farX),
    segmentIntersectionCount(x, rayEnd, t, c(farX, t.im)),
  );

  return (purpleParity + redParity) % 2 === 0 ? root : neg(root);
}

function chooseContinuous(root, previous) {
  if (!previous) {
    return root;
  }
  return distance(root, previous) <= distance(neg(root), previous) ? root : neg(root);
}

function nearPeriodSingularity(point, t) {
  return Math.min(
    distance(point, leftBranch),
    distance(point, rightBranch),
    distance(point, t),
  ) < periodIntegration.singularNeighborhood;
}

function integrationSubdivisions(a, b, t) {
  const length = distance(a, b);
  const minimum = nearPeriodSingularity(a, t) || nearPeriodSingularity(b, t) ? 3 : 1;
  return Math.max(minimum, Math.ceil(length / periodIntegration.quadratureStep));
}

function sampleLine(start, end, count) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const u = i / (count - 1);
    points.push(c(
      start.re + (end.re - start.re) * u,
      start.im + (end.im - start.im) * u,
    ));
  }
  return points;
}

function sampleBezier(p0, p1, p2, p3, count) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const u = i / (count - 1);
    const v = 1 - u;
    const a = v * v * v;
    const b = 3 * v * v * u;
    const d = 3 * v * u * u;
    const e = u * u * u;
    points.push(c(
      a * p0.re + b * p1.re + d * p2.re + e * p3.re,
      a * p0.im + b * p1.im + d * p2.im + e * p3.im,
    ));
  }
  return points;
}

function sampleArc(center, radius, startAngle, endAngle, count) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const u = i / (count - 1);
    const theta = startAngle + (endAngle - startAngle) * u;
    points.push(c(
      center.re + radius * Math.cos(theta),
      center.im + radius * Math.sin(theta),
    ));
  }
  return points;
}

function joinPaths(parts) {
  const points = [];
  for (const part of parts) {
    if (points.length > 0) {
      part.shift();
    }
    points.push(...part);
  }
  return points;
}

function sampleContourOne() {
  return joinPaths([
    sampleBezier(
      clone(contourStart),
      c(2.95, 0.82),
      c(1.58, 1.36),
      c(0.58, 1.28),
      140,
    ),
    sampleBezier(
      c(0.58, 1.28),
      c(0.0, 1.22),
      c(-0.58, 0.72),
      c(-0.38, 0.34),
      160,
    ),
    sampleBezier(
      c(-0.38, 0.34),
      c(-0.28, 0.15),
      c(-0.1, 0.055),
      clone(leftBranch),
      90,
    ),
  ]);
}

function branchCutFrame(points, index) {
  const last = points.length - 1;
  const previous = points[Math.max(0, index - 1)];
  const next = points[Math.min(last, index + 1)];
  const tangent = normalize(sub(next, previous), c(1, 0));
  return {
    tangent,
    normal: c(-tangent.im, tangent.re),
  };
}

function branchTubePoint(center, frame, theta, direction) {
  const tangentPart = scale(frame.tangent, direction * branchTube.capRadius * Math.cos(theta));
  const normalPart = scale(frame.normal, branchTube.halfWidth * Math.sin(theta));
  return add(center, add(tangentPart, normalPart));
}

function branchTubeCenters() {
  return simplifyOpenPath(state.branch01, {
    locked: state.branch01Locked,
    tolerance: branchTube.centerCullTolerance,
    maxSegment: branchTube.centerCullMaxSegment,
    keep: (point) => (
      distance(point, state.t) < pointPush.branchRadius * 1.15
      || isInProtectedZone(point, protectedZone.lockRadius + 0.02)
    ),
  });
}

function rebuildContourTwoFromBranchCut() {
  if (state.branch01.length < 2) {
    state.contourTwo = [];
    state.contourTwoLocked = [];
    return;
  }

  const centers = branchTubeCenters();
  const points = [];
  const last = centers.length - 1;
  const startFrame = branchCutFrame(centers, 0);
  const endFrame = branchCutFrame(centers, last);

  for (let i = 0; i <= last; i += 1) {
    const frame = branchCutFrame(centers, i);
    points.push(add(centers[i], scale(frame.normal, -branchTube.halfWidth)));
  }

  for (let s = 1; s < branchTube.capSegments; s += 1) {
    const theta = -Math.PI / 2 + (Math.PI * s) / branchTube.capSegments;
    points.push(branchTubePoint(centers[last], endFrame, theta, 1));
  }

  for (let i = last; i >= 0; i -= 1) {
    const frame = branchCutFrame(centers, i);
    points.push(add(centers[i], scale(frame.normal, branchTube.halfWidth)));
  }

  for (let s = 1; s < branchTube.capSegments; s += 1) {
    const theta = Math.PI / 2 - (Math.PI * s) / branchTube.capSegments;
    points.push(branchTubePoint(centers[0], startFrame, theta, -1));
  }

  state.contourTwo = points;
  state.contourTwoLocked = points.map((point) => isInProtectedZone(
    point,
    protectedZone.lockRadius,
  ));
}

function createBaseState() {
  state.t = clone(initialT);
  state.periods = [c(0, 0), c(0, 0)];
  state.referencePeriods = [c(0, 0), c(0, 0)];
  state.periodUpdatePending = false;
  state.branch01 = sampleLine(clone(leftBranch), clone(rightBranch), contourMesh.branchCutInitialCount);
  refreshBranchCutLocks();
  state.tCut = sampleLine(clone(initialT), c(xView.xmax + 0.28, initialT.im), 130);
  state.contourOne = sampleContourOne();
  refreshSharedStartLocks();
  rebuildContourTwoFromBranchCut();
  updatePeriods();
  state.referencePeriods = state.periods.map(clone);
  state.periodLimit = periodLimitFor(state.referencePeriods);
  periodOneReadout.textContent =
    `Iγ = 2 int(λ->3->0) = ${formatComplex(state.periods[0])} = ${formatBasisCombination(state.periods[0])}`;
  periodTwoReadout.textContent =
    `Iδ = int(δ) = ${formatComplex(state.periods[1])} = ${formatBasisCombination(state.periods[1])}`;
}

function isInProtectedZone(point, radius = protectedZone.radius) {
  return criticalPoints.some((center) => distance(point, center) <= radius);
}

function isNearSharedStart(point, radius = sharedStartLock.radius) {
  return distance(point, contourStart) <= radius;
}

function refreshSharedStartLocks() {
  state.tCutLocked = state.tCut.map((point) => isNearSharedStart(point));
  state.contourOneLocked = state.contourOne.map((point) => isNearSharedStart(point));
}

function refreshBranchCutLocks() {
  state.branch01Locked = state.branch01.map((point) => isInProtectedZone(
    point,
    protectedZone.lockRadius,
  ));
}

function segmentCircleEntry(start, end, center, radius) {
  const delta = sub(end, start);
  const offset = sub(start, center);
  const a = dot(delta, delta);
  if (a < 0.000001) {
    return null;
  }

  const b = 2 * dot(offset, delta);
  const cc = dot(offset, offset) - radius * radius;
  const discriminant = b * b - 4 * a * cc;
  if (discriminant < 0) {
    return null;
  }

  const root = Math.sqrt(discriminant);
  const t1 = (-b - root) / (2 * a);
  const t2 = (-b + root) / (2 * a);
  const candidates = [t1, t2].filter((t) => t > 0.0001 && t <= 1);
  return candidates.length ? Math.min(...candidates) : null;
}

function constrainProtectedZones(target, previous) {
  let constrained = clone(target);
  const radius = protectedZone.radius + 0.006;

  for (const center of criticalPoints) {
    if (previous && distance(previous, center) > radius) {
      const hit = segmentCircleEntry(previous, constrained, center, radius);
      if (hit !== null) {
        const travel = sub(constrained, previous);
        const length = abs(travel);
        if (length > 0.000001) {
          const allowed = Math.max(0, hit * length - 0.004);
          constrained = add(previous, scale(travel, allowed / length));
        }
      }
    }

    const away = sub(constrained, center);
    const d = abs(away);
    if (d < radius) {
      let direction = d > 0.000001 ? scale(away, 1 / d) : null;
      if (!direction && previous) {
        const fallback = sub(previous, center);
        const fallbackDistance = abs(fallback);
        direction = fallbackDistance > 0.000001 ? scale(fallback, 1 / fallbackDistance) : null;
      }
      direction = direction || c(0, 1);
      constrained = add(center, scale(direction, radius));
    }
  }

  return constrained;
}

function clampT(z, previous = null) {
  const margin = 0.08;
  const clamped = c(
    Math.min(xView.xmax - margin, Math.max(xView.xmin + margin, z.re)),
    Math.min(xView.ymax - margin, Math.max(xView.ymin + margin, z.im)),
  );
  return constrainProtectedZones(clamped, previous);
}

function smoothstep(edge) {
  const x = Math.max(0, Math.min(1, edge));
  return x * x * (3 - 2 * x);
}

function deformPoint(point, oldT, newT, options = {}) {
  const delta = sub(newT, oldT);
  const motion = abs(delta);
  const relative = sub(point, newT);
  const d = abs(relative);
  const baseRadius = options.radius || sourceField.radius;
  const baseClearance = options.clearance || sourceField.clearance;
  const strength = options.strength || sourceField.strength;
  const radius = baseRadius + Math.min(0.08, motion * 0.9);

  if (d >= radius) {
    return point;
  }

  let direction;
  if (d > 0.00001) {
    direction = scale(relative, 1 / d);
  } else if (motion > 0.00001) {
    direction = scale(c(-delta.im, delta.re), 1 / motion);
  } else {
    direction = c(0, 1);
  }

  const falloff = 1 - smoothstep(d / radius);
  const clearance = Math.max(0, baseClearance - d) * 0.9;
  const amount = strength * falloff * falloff * (0.58 * motion + 0.012) + clearance;
  return add(point, scale(direction, amount));
}

function deformPath(points, oldT, newT, options = {}) {
  const fixedStart = Boolean(options.fixedStart);
  const fixedEnd = Boolean(options.fixedEnd);
  const locked = options.locked || [];
  const start = fixedStart ? 1 : 0;
  const end = fixedEnd ? points.length - 1 : points.length;

  for (let i = start; i < end; i += 1) {
    if (locked[i]) {
      continue;
    }
    points[i] = deformPoint(points[i], oldT, newT, options);
  }
}

function criticalFade(point) {
  let fade = 1;
  for (const center of criticalPoints) {
    const d = distance(point, center);
    const u = (d - protectedZone.lockRadius) / pointPush.obstacleFeather;
    fade *= smoothstep(u);
  }
  return fade;
}

function repelPointFromCenter(point, center, fallback, options = {}) {
  const radius = options.radius || sourceField.radius;
  const clearance = options.clearance || sourceField.clearance;
  const strength = options.strength || sourceField.strength;
  const offset = sub(point, center);
  const d = abs(offset);

  if (d >= radius) {
    return point;
  }

  const direction = d > 0.00001
    ? scale(offset, 1 / d)
    : normalize(fallback, c(0, 1));
  const pressure = (1 - smoothstep(d / radius)) * criticalFade(point);
  const targetDistance = Math.min(radius * 0.96, Math.max(
    d + pressure * strength * 0.035,
    clearance + pressure * strength * 0.018,
  ));
  return add(center, scale(direction, Math.max(d, targetDistance)));
}

function repelPathFromPoint(points, center, fallback, options = {}) {
  const fixedStart = Boolean(options.fixedStart);
  const fixedEnd = Boolean(options.fixedEnd);
  const locked = options.locked || [];
  const start = Math.max(fixedStart ? 1 : 0, options.skipStart || 0);
  const end = fixedEnd ? points.length - 1 : points.length;

  for (let i = start; i < end; i += 1) {
    if (locked[i]) {
      continue;
    }
    points[i] = repelPointFromCenter(points[i], center, fallback, options);
  }
}

function nearestPointOnSegment(point, a, b) {
  const segment = sub(b, a);
  const lengthSquared = dot(segment, segment);
  if (lengthSquared < 0.000001) {
    return {
      point: clone(a),
      distance: distance(point, a),
      tangent: c(1, 0),
      u: 0,
    };
  }

  const u = Math.max(0, Math.min(1, dot(sub(point, a), segment) / lengthSquared));
  const projection = add(a, scale(segment, u));
  return {
    point: projection,
    distance: distance(point, projection),
    tangent: normalize(segment),
    u,
  };
}

function canCullPoint(point, previous, next, options = {}) {
  if (distance(previous, next) > (options.maxSegment || 0.2)) {
    return false;
  }

  const nearest = nearestPointOnSegment(point, previous, next);
  const tolerance = options.tolerance || 0.004;
  return nearest.u > 0.001
    && nearest.u < 0.999
    && nearest.distance <= tolerance
    && shortcutKeepsClear(previous, next, options.clearanceChecks || []);
}

function shortcutKeepsClear(previous, next, checks) {
  if (checks.length === 0) {
    return true;
  }

  const shortcut = [previous, next];
  for (const check of checks) {
    if (!check.path || check.path.length < 2) {
      continue;
    }

    if (pathsIntersect(shortcut, false, check.path, Boolean(check.closed), check.allow)) {
      return false;
    }

    const samples = check.samples || 3;
    for (let i = 1; i <= samples; i += 1) {
      const sample = lerp(previous, next, i / (samples + 1));
      const nearest = nearestPointOnPath(sample, check.path, {
        closed: Boolean(check.closed),
        skipStart: check.skipStart || 0,
      });
      if (nearest && nearest.distance < check.clearance) {
        return false;
      }
    }
  }

  return true;
}

function simplifyOpenPath(points, options = {}) {
  if (points.length <= 2) {
    return points;
  }

  const locked = options.locked || [];
  const preserveStartCount = options.preserveStartCount || 0;
  const keep = options.keep || (() => false);
  const kept = [0];

  for (let i = 1; i < points.length - 1; i += 1) {
    const point = points[i];
    const last = points[kept[kept.length - 1]];
    const next = points[i + 1];
    const mustKeep = locked[i]
      || i < preserveStartCount
      || keep(point, i)
      || !canCullPoint(point, last, next, options);

    if (mustKeep) {
      kept.push(i);
    }
  }

  kept.push(points.length - 1);
  return kept.map((index) => points[index]);
}

function simplifyClosedPath(points, metadata, options = {}) {
  const count = points.length;
  const minPoints = options.minPoints || 32;
  if (count <= minPoints) {
    return { points, metadata };
  }

  const locked = metadata[0] || [];
  const keep = options.keep || (() => false);
  const anchor = Math.max(0, locked.findIndex(Boolean));
  const kept = [anchor];

  for (let step = 1; step < count; step += 1) {
    const index = (anchor + step) % count;
    const nextIndex = (anchor + step + 1) % count;
    const point = points[index];
    const last = points[kept[kept.length - 1]];
    const next = points[nextIndex];
    const mustKeep = locked[index]
      || keep(point, index)
      || !canCullPoint(point, last, next, options);

    if (mustKeep) {
      kept.push(index);
    }
  }

  if (kept.length < minPoints) {
    return { points, metadata };
  }

  return {
    points: kept.map((index) => points[index]),
    metadata: metadata.map((items) => kept.map((index) => items[index])),
  };
}

function subdivideOpenPath(points, options = {}) {
  const maxSegment = options.maxSegment || 0.02;
  const maxPoints = options.maxPoints || 900;

  const nextPoints = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    nextPoints.push(a);

    if (nextPoints.length >= maxPoints) {
      continue;
    }

    const pieces = Math.min(4, Math.ceil(distance(a, b) / maxSegment));
    for (let piece = 1; piece < pieces; piece += 1) {
      nextPoints.push(lerp(a, b, piece / pieces));
      if (nextPoints.length >= maxPoints) {
        break;
      }
    }
  }
  nextPoints.push(points[points.length - 1]);
  const limited = nextPoints.slice(0, maxPoints);
  limited[limited.length - 1] = points[points.length - 1];
  return limited;
}

function subdivideClosedPath(points, metadata, options = {}) {
  const maxSegment = options.maxSegment || 0.02;
  const maxPoints = options.maxPoints || 1200;

  const nextPoints = [];
  const nextMetadata = metadata.map(() => []);
  const count = points.length;

  for (let i = 0; i < count; i += 1) {
    const next = (i + 1) % count;
    const a = points[i];
    const b = points[next];
    nextPoints.push(a);
    for (let m = 0; m < metadata.length; m += 1) {
      nextMetadata[m].push(metadata[m][i]);
    }

    if (nextPoints.length >= maxPoints) {
      continue;
    }

    const pieces = Math.min(4, Math.ceil(distance(a, b) / maxSegment));
    for (let piece = 1; piece < pieces; piece += 1) {
      const u = piece / pieces;
      nextPoints.push(lerp(a, b, u));
      nextMetadata[0].push(Boolean(metadata[0][i] && metadata[0][next]));
      nextMetadata[1].push(metadata[1][i] || metadata[1][next] || 1);
      if (nextPoints.length >= maxPoints) {
        break;
      }
    }
  }

  return {
    points: nextPoints.slice(0, maxPoints),
    metadata: nextMetadata.map((items) => items.slice(0, maxPoints)),
  };
}

function smoothPath(points, options = {}) {
  const closed = Boolean(options.closed);
  const locked = options.locked || [];
  const fixedStart = Boolean(options.fixedStart);
  const fixedEnd = Boolean(options.fixedEnd);
  const passes = options.passes || contourMesh.smoothPasses;
  const weight = options.weight || contourMesh.smoothWeight;
  let smoothed = points;

  for (let pass = 0; pass < passes; pass += 1) {
    const next = smoothed.map(clone);
    const start = closed || !fixedStart ? 0 : 1;
    const end = closed || !fixedEnd ? smoothed.length : smoothed.length - 1;

    for (let i = start; i < end; i += 1) {
      if (locked[i]) {
        continue;
      }

      const prevIndex = i === 0 ? smoothed.length - 1 : i - 1;
      const nextIndex = i === smoothed.length - 1 ? 0 : i + 1;
      if (!closed && (i === 0 || i === smoothed.length - 1)) {
        continue;
      }

      const midpoint = scale(add(smoothed[prevIndex], smoothed[nextIndex]), 0.5);
      next[i] = lerp(smoothed[i], midpoint, weight);
    }
    smoothed = next;
  }

  return smoothed;
}

function refineBranchCut() {
  state.branch01 = subdivideOpenPath(state.branch01, {
    maxSegment: contourMesh.branchCutMaxSegment,
    maxPoints: Math.max(contourMesh.branchCutMaxPoints, state.branch01.length),
  });
  refreshBranchCutLocks();
}

function refineIntegrationContours() {
  refineBranchCut();

  state.contourOne = subdivideOpenPath(state.contourOne, {
    maxSegment: contourMesh.contourOneMaxSegment,
    maxPoints: Math.max(contourMesh.contourOneMaxPoints, state.contourOne.length),
  });
  refreshSharedStartLocks();

  state.contourOne = smoothPath(state.contourOne, {
    fixedStart: true,
    fixedEnd: true,
    locked: state.contourOneLocked,
  });
  refreshSharedStartLocks();
  rebuildContourTwoFromBranchCut();
}

function simplifyDeformedGeometry() {
  const activeTraceStart = activeTCutStartIndex();
  const movingInfluenceRadius = Math.max(
    sourceField.radius,
    pointPush.branchRadius,
    pointPush.tCutRadius,
  );
  const keepNearT = (point) => distance(point, state.t) < movingInfluenceRadius * 1.35;
  const keepNearBranch = (point) => isInProtectedZone(
    point,
    protectedZone.lockRadius + 0.035,
  );
  const nearCheckedObstacle = (point, checks) => checks.some((check) => {
    if (!check.path || check.path.length < 2) {
      return false;
    }
    const nearest = nearestPointOnPath(point, check.path, {
      closed: Boolean(check.closed),
      skipStart: check.skipStart || 0,
    });
    return nearest && nearest.distance < check.clearance * 1.35;
  });
  const branchCutChecks = [
    {
      path: state.contourOne,
      clearance: 0.075,
    },
    {
      path: state.tCut,
      clearance: 0.075,
      skipStart: activeTraceStart,
    },
  ];

  state.branch01 = simplifyOpenPath(state.branch01, {
    locked: state.branch01Locked,
    tolerance: contourMesh.branchCutCullTolerance,
    maxSegment: contourMesh.branchCutCullMaxSegment,
    clearanceChecks: branchCutChecks,
    keep: (point) => (
      keepNearT(point)
      || keepNearBranch(point)
      || nearCheckedObstacle(point, branchCutChecks)
    ),
  });
  state.branch01Locked = state.branch01.map((point) => isInProtectedZone(
    point,
    protectedZone.lockRadius,
  ));
  rebuildContourTwoFromBranchCut();

  const redCutChecks = [
    {
      path: state.contourOne,
      clearance: 0.085,
    },
    {
      path: state.contourTwo,
      closed: true,
      clearance: 0.1,
    },
    {
      path: state.branch01,
      clearance: 0.075,
    },
  ];
  state.tCut = simplifyOpenPath(state.tCut, {
    locked: state.tCutLocked,
    preserveStartCount: activeTraceStart,
    tolerance: contourMesh.tCutCullTolerance,
    maxSegment: contourMesh.tCutCullMaxSegment,
    clearanceChecks: redCutChecks,
    keep: (point) => (
      keepNearT(point)
      || isNearSharedStart(point, sharedStartLock.radius + 0.02)
      || nearCheckedObstacle(point, redCutChecks)
    ),
  });
  refreshSharedStartLocks();

  const contourOneChecks = [
    {
      path: state.branch01,
      clearance: 0.075,
    },
    {
      path: state.tCut,
      clearance: 0.085,
      skipStart: activeTraceStart,
    },
  ];
  state.contourOne = simplifyOpenPath(state.contourOne, {
    locked: state.contourOneLocked,
    tolerance: contourMesh.contourOneCullTolerance,
    maxSegment: contourMesh.contourOneCullMaxSegment,
    clearanceChecks: contourOneChecks,
    keep: (point) => (
      keepNearT(point)
      || keepNearBranch(point)
      || nearCheckedObstacle(point, contourOneChecks)
    ),
  });
  refreshSharedStartLocks();
  rebuildContourTwoFromBranchCut();
}

function segmentIntersectionParameter(a, b, p, q) {
  const r = sub(b, a);
  const s = sub(q, p);
  const denominator = cross(r, s);
  if (Math.abs(denominator) < 0.000001) {
    return null;
  }

  const offset = sub(p, a);
  const t = cross(offset, s) / denominator;
  const u = cross(offset, r) / denominator;
  if (t > 0.0001 && t <= 1 && u >= 0 && u <= 1) {
    return t;
  }
  return null;
}

function segmentIntersection(a, b, p, q) {
  const r = sub(b, a);
  const s = sub(q, p);
  const denominator = cross(r, s);
  if (Math.abs(denominator) < 0.000001) {
    return null;
  }

  const offset = sub(p, a);
  const t = cross(offset, s) / denominator;
  const u = cross(offset, r) / denominator;
  const epsilon = 0.0001;
  if (t > epsilon && t < 1 - epsilon && u > epsilon && u < 1 - epsilon) {
    return { point: add(a, scale(r, t)), t, u };
  }
  return null;
}

function forEachSegment(points, closed, callback) {
  const count = closed ? points.length : points.length - 1;
  for (let i = 0; i < count; i += 1) {
    callback(points[i], points[(i + 1) % points.length], i);
  }
}

function pathsIntersect(pathA, closedA, pathB, closedB, allow = () => false) {
  let intersects = false;
  forEachSegment(pathA, closedA, (a0, a1, indexA) => {
    if (intersects) {
      return;
    }
    forEachSegment(pathB, closedB, (b0, b1, indexB) => {
      if (intersects) {
        return;
      }
      if (!segmentBoxesOverlap(a0, a1, b0, b1)) {
        return;
      }
      const hit = segmentIntersection(a0, a1, b0, b1);
      if (hit && !allow(hit.point, indexA, indexB)) {
        intersects = true;
      }
    });
  });
  return intersects;
}

function segmentBoxesOverlap(a0, a1, b0, b1) {
  const pad = 0.0005;
  const aMinX = Math.min(a0.re, a1.re) - pad;
  const aMaxX = Math.max(a0.re, a1.re) + pad;
  const aMinY = Math.min(a0.im, a1.im) - pad;
  const aMaxY = Math.max(a0.im, a1.im) + pad;
  const bMinX = Math.min(b0.re, b1.re) - pad;
  const bMaxX = Math.max(b0.re, b1.re) + pad;
  const bMinY = Math.min(b0.im, b1.im) - pad;
  const bMaxY = Math.max(b0.im, b1.im) + pad;

  return aMinX <= bMaxX && aMaxX >= bMinX && aMinY <= bMaxY && aMaxY >= bMinY;
}

function pathIndexAfterDistance(points, minDistance) {
  if (points.length < 2) {
    return points.length;
  }

  let travelled = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    travelled += distance(points[i], points[i + 1]);
    if (travelled >= minDistance) {
      return i + 1;
    }
  }
  return points.length;
}

function activeTCutStartIndex() {
  return pathIndexAfterDistance(state.tCut, traceInteraction.activeAfterDistance);
}

function activeTCutPackageStartIndex() {
  return pathIndexAfterDistance(state.tCut, traceInteraction.packageActiveAfterDistance);
}

function activeTCutPath() {
  const start = activeTCutStartIndex();
  return start < state.tCut.length - 1 ? state.tCut.slice(start) : [];
}

function cutCompatibilityIssue() {
  const c1Start = state.contourOne[0];
  const c1Endpoint = state.contourOne[state.contourOne.length - 1];
  const allowC1Start = (point) => (
    distance(point, c1Start) < 0.06 || isNearSharedStart(point, sharedStartLock.radius + 0.02)
  );
  const allowC1Endpoint = (point) => distance(point, c1Endpoint) < 0.055;

  // The green contour is allowed to land on the branch point at 0; every other
  // dashed-cut/integration-contour crossing should block the drag step. It is
  // also allowed to start on the red branch cut.
  if (state.tCut.length >= 2) {
    if (pathsIntersect(state.contourTwo, true, state.tCut, false)) {
      return "red-ellipse";
    }
    if (pathsIntersect(state.contourOne, false, state.tCut, false, allowC1Start)) {
      return "red-green";
    }
  }
  if (pathsIntersect(state.contourOne, false, state.branch01, false, allowC1Endpoint)) {
    return "branch-green";
  }
  return null;
}

function pathsAreCutCompatible() {
  return cutCompatibilityIssue() === null;
}

function snapshotGeometry() {
  return {
    t: clone(state.t),
    branch01: clonePath(state.branch01),
    tCut: clonePath(state.tCut),
    tCutLocked: [...state.tCutLocked],
    contourOne: clonePath(state.contourOne),
    contourOneLocked: [...state.contourOneLocked],
    contourTwo: clonePath(state.contourTwo),
    contourTwoLocked: [...state.contourTwoLocked],
  };
}

function restoreGeometry(snapshot) {
  state.t = snapshot.t;
  state.branch01 = snapshot.branch01;
  state.tCut = snapshot.tCut;
  state.tCutLocked = snapshot.tCutLocked;
  state.contourOne = snapshot.contourOne;
  state.contourOneLocked = snapshot.contourOneLocked;
  state.contourTwo = snapshot.contourTwo;
  state.contourTwoLocked = snapshot.contourTwoLocked;
}

function nearestBranchPoint(point) {
  let best = null;
  for (let i = 0; i < state.branch01.length - 1; i += 1) {
    const candidate = nearestPointOnSegment(point, state.branch01[i], state.branch01[i + 1]);
    if (!best || candidate.distance < best.distance) {
      best = candidate;
    }
  }
  return best;
}

function nearestPointOnPath(point, path, options = {}) {
  const skipStart = options.skipStart || 0;
  const closed = Boolean(options.closed);
  const count = closed ? path.length : path.length - 1;
  let best = null;
  for (let i = skipStart; i < count; i += 1) {
    const candidate = nearestPointOnSegment(point, path[i], path[(i + 1) % path.length]);
    candidate.index = i;
    if (!best || candidate.distance < best.distance) {
      best = candidate;
    }
  }
  return best;
}

function keepPathAwayFromCut(points, cut, options = {}) {
  const locked = options.locked || [];
  const clearance = options.clearance || 0.08;
  const fixedStart = Boolean(options.fixedStart);
  const fixedEnd = Boolean(options.fixedEnd);
  const start = Math.max(fixedStart ? 1 : 0, options.skipStart || 0);
  const end = fixedEnd ? points.length - 1 : points.length;

  for (let i = start; i < end; i += 1) {
    if (locked[i]) {
      continue;
    }

    const nearest = nearestPointOnPath(points[i], cut, {
      closed: Boolean(options.cutClosed),
      skipStart: options.skipCutStart || 0,
    });
    if (!nearest || nearest.distance >= clearance) {
      continue;
    }

    let direction = sub(points[i], nearest.point);
    direction = normalize(direction, c(-nearest.tangent.im, nearest.tangent.re));
    points[i] = add(nearest.point, scale(direction, clearance));
  }
}

function repairCutContourSeparation(options = {}) {
  const activeTraceStart = activeTCutStartIndex();
  const activePackageTraceStart = activeTCutPackageStartIndex();
  const passes = options.passes || 5;

  rebuildContourTwoFromBranchCut();
  for (let pass = 0; pass < passes; pass += 1) {
    keepPathAwayFromCut(state.tCut, state.contourTwo, {
      locked: state.tCutLocked,
      skipStart: activePackageTraceStart,
      cutClosed: true,
      clearance: pointPush.packageTCutClearance,
    });
    keepPathAwayFromCut(state.tCut, state.contourOne, {
      locked: state.tCutLocked,
      skipStart: activePackageTraceStart,
      clearance: pointPush.packageContourClearance,
    });
    refreshSharedStartLocks();

    keepPathAwayFromCut(state.contourOne, state.branch01, {
      fixedStart: true,
      fixedEnd: true,
      locked: state.contourOneLocked,
      clearance: 0.07,
    });
    keepPathAwayFromCut(state.contourOne, state.tCut, {
      fixedStart: true,
      fixedEnd: true,
      locked: state.contourOneLocked,
      clearance: 0.08,
      skipCutStart: activeTraceStart,
    });
  }
  rebuildContourTwoFromBranchCut();
}

function rebuildBranchPackage() {
  rebuildContourTwoFromBranchCut();
}

function updateTCut(next) {
  if (distance(state.tCut[0], next) > 0.012) {
    state.tCut.unshift(clone(next));
    if (state.tCut.length > 950) {
      const fixedEnd = state.tCut.pop();
      state.tCut = state.tCut.filter((_, index) => index < 420 || index % 2 === 0);
      state.tCut.push(fixedEnd);
    }
  } else {
    state.tCut[0] = clone(next);
  }
  refreshSharedStartLocks();
}

function repelGeometryFromMovingPoint(oldT, next) {
  const motion = sub(next, oldT);
  const fallback = abs(motion) > 0.00001
    ? normalize(c(-motion.im, motion.re), c(0, 1))
    : c(0, 1);

  for (let pass = 0; pass < pointPush.repulsionPasses; pass += 1) {
    repelPathFromPoint(state.branch01, next, fallback, {
      fixedStart: true,
      fixedEnd: true,
      locked: state.branch01Locked,
      radius: pointPush.branchRadius,
      clearance: pointPush.branchClearance,
      strength: pointPush.branchStrength,
    });
    repelPathFromPoint(state.tCut, next, fallback, {
      fixedStart: true,
      locked: state.tCutLocked,
      skipStart: activeTCutStartIndex(),
      radius: pointPush.tCutRadius,
      clearance: pointPush.tCutClearance,
    });
    refreshSharedStartLocks();
    repelPathFromPoint(state.contourOne, next, fallback, {
      fixedStart: true,
      fixedEnd: true,
      locked: state.contourOneLocked,
      radius: sourceField.radius,
      clearance: pointPush.contourOneClearance,
    });
  }
  rebuildContourTwoFromBranchCut();
}

function moveTStep(nextT, options = {}) {
  const settle = options.settle !== false;
  const before = options.snapshot === false ? null : snapshotGeometry();
  const oldT = clone(state.t);
  const next = clampT(nextT, oldT);

  if (distance(oldT, next) < 0.0001) {
    return false;
  }

  refineBranchCut();
  repelGeometryFromMovingPoint(oldT, next);
  state.t = next;
  updateTCut(next);
  refineIntegrationContours();
  repairCutContourSeparation({
    passes: settle ? 4 : 1,
  });

  if (settle) {
    repelGeometryFromMovingPoint(oldT, next);
    repairCutContourSeparation({
      passes: 3,
    });
    simplifyDeformedGeometry();
    rebuildBranchPackage();
    if (!pathsAreCutCompatible()) {
      if (before) {
        restoreGeometry(before);
      }
      return false;
    }
  }
  return true;
}

function advanceT(nextT, options = {}) {
  const start = clone(state.t);
  const target = clampT(nextT, start);
  const length = distance(start, target);
  if (length < 0.0001) {
    return true;
  }

  const before = snapshotGeometry();
  const stepSize = options.step || dragConstraint.step;
  const maxSteps = options.maxSteps || dragConstraint.maxSteps;
  const steps = Math.min(
    maxSteps,
    Math.max(1, Math.ceil(length / stepSize)),
  );
  let completed = true;
  for (let i = 1; i <= steps; i += 1) {
    const candidate = lerp(start, target, i / steps);
    const moved = moveTStep(candidate, {
      settle: i === steps,
      snapshot: false,
    });
    if (!moved) {
      completed = false;
      break;
    }
  }

  if (!completed) {
    restoreGeometry(before);
    return false;
  }

  if (!pathsAreCutCompatible()) {
    restoreGeometry(before);
    return false;
  }

  return distance(state.t, target) < 0.01;
}

function moveT(nextT) {
  const completed = advanceT(nextT);
  tReadout.textContent = `λ = ${formatComplex(state.t)}`;
  if (state.dynamicPeriodUpdates) {
    updatePeriods();
    draw();
  } else {
    state.periodUpdatePending = true;
    drawParameterPlane();
  }
  return completed;
}

function setDynamicPeriodUpdateControl() {
  if (dynamicPeriodUpdatesToggle) {
    dynamicPeriodUpdatesToggle.checked = state.dynamicPeriodUpdates;
  }
}

function setDynamicPeriodUpdates(enabled) {
  state.dynamicPeriodUpdates = enabled;
  setDynamicPeriodUpdateControl();
  if (enabled && state.periodUpdatePending) {
    updatePeriods();
    state.periodUpdatePending = false;
    draw();
  }
}

function integratePath(points, t, options = {}) {
  const closed = Boolean(options.closed);
  const totalSegments = closed ? points.length : points.length - 1;
  let total = c(0, 0);
  let previousRoot = null;

  for (let i = 0; i < totalSegments; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const dx = sub(b, a);
    const subdivisions = integrationSubdivisions(a, b, t);
    const step = scale(dx, 1 / subdivisions);

    for (let j = 0; j < subdivisions; j += 1) {
      const mid = add(a, scale(dx, (j + 0.5) / subdivisions));
      let root = globalSquareRoot(mid, t);
      root = chooseContinuous(root, previousRoot);
      const integrand = reciprocal(root);
      total = add(total, mul(integrand, step));
      previousRoot = root;
    }
  }

  return total;
}

function tCutLegToContourOneStart() {
  const target = state.contourOne[0] || contourStart;
  const nearest = nearestPointOnPath(target, state.tCut);
  if (!nearest) {
    return {
      points: [clone(state.t), clone(target)],
      tangent: normalize(sub(target, state.t), c(1, 0)),
    };
  }

  const points = [];
  for (let i = 0; i <= nearest.index; i += 1) {
    points.push(clone(state.tCut[i]));
  }

  if (
    nearest.u > 0.0001
    && nearest.u < 0.9999
    && distance(points[points.length - 1], nearest.point) > 0.00001
  ) {
    points.push(clone(nearest.point));
  }

  if (distance(points[points.length - 1], target) > 0.00001) {
    points.push(clone(target));
  }

  return {
    points,
    tangent: nearest.tangent,
  };
}

function offsetPathToOneSide(points, offset, sideSign) {
  if (points.length <= 2) {
    return points.map(clone);
  }

  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) {
      return clone(point);
    }

    const previous = points[index - 1];
    const next = points[index + 1];
    const tangent = normalize(sub(next, previous), c(1, 0));
    const normal = c(-tangent.im, tangent.re);
    return add(point, scale(normal, offset * sideSign));
  });
}

function contourOnePeriodPath() {
  const leg = tCutLegToContourOneStart();
  const denseLeg = subdivideOpenPath(leg.points, {
    maxSegment: periodIntegration.redCutMaxSegment,
    maxPoints: periodIntegration.redCutMaxPoints,
  });
  const greenDirection = state.contourOne.length > 1
    ? normalize(sub(state.contourOne[1], state.contourOne[0]), c(0, 1))
    : c(0, 1);
  const leftNormal = c(-leg.tangent.im, leg.tangent.re);
  const sideSign = dot(leftNormal, greenDirection) >= 0 ? 1 : -1;
  const redLeg = offsetPathToOneSide(
    denseLeg,
    periodIntegration.redCutSideOffset,
    sideSign,
  );
  return joinPaths([redLeg, clonePath(state.contourOne)]);
}

function stabilizePeriodVectorSign(period, previous) {
  if (abs(previous) < 0.0001 || abs(period) < 0.0001) {
    return period;
  }

  const flipped = neg(period);
  return distance(flipped, previous) + 0.000001 < distance(period, previous)
    ? flipped
    : period;
}

function stabilizePeriodSigns(periods) {
  const previous = state.periods;
  if (abs(previous[0]) + abs(previous[1]) < 0.0001) {
    return periods;
  }

  return periods.map((period, index) => stabilizePeriodVectorSign(period, previous[index]));
}

function directPeriodPair() {
  const rawOne = integratePath(contourOnePeriodPath(), state.t);
  const rawTwo = integratePath(state.contourTwo, state.t, {
    closed: true,
  });
  return [scale(rawOne, 2), rawTwo];
}

function updatePeriods() {
  const [p1, p2] = stabilizePeriodSigns(directPeriodPair());
  state.periods = [p1, p2];
  state.periodUpdatePending = false;

  tReadout.textContent = `λ = ${formatComplex(state.t)}`;
  periodOneReadout.textContent = `Iγ = 2 int(λ->3->0) = ${formatComplex(p1)} = ${formatBasisCombination(p1)}`;
  periodTwoReadout.textContent = `Iδ = int(δ) = ${formatComplex(p2)} = ${formatBasisCombination(p2)}`;
}

function periodLimitFor(periods) {
  const maxPeriod = Math.max(
    0.25,
    abs(periods[0]),
    abs(periods[1]),
    abs(add(periods[0], periods[1])) * 0.72,
  );
  return Math.max(3, Math.ceil(maxPeriod * 1.35));
}

function formatComplex(z) {
  const re = z.re.toFixed(3);
  const sign = z.im < 0 ? "-" : "+";
  const im = Math.abs(z.im).toFixed(3);
  return `${re} ${sign} ${im}i`;
}

function basisCoordinates(vector) {
  const v1 = state.referencePeriods[0];
  const v2 = state.referencePeriods[1];
  const determinant = cross(v1, v2);
  if (Math.abs(determinant) < 0.000001) {
    return null;
  }

  return {
    v1: cross(vector, v2) / determinant,
    v2: cross(v1, vector) / determinant,
  };
}

function formatBasisScalar(value) {
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 0.025) {
    return `${rounded}`;
  }
  return value.toFixed(2);
}

function formatBasisCombination(vector) {
  const coordinates = basisCoordinates(vector);
  if (!coordinates) {
    return "basis pending";
  }

  const first = formatBasisScalar(coordinates.v1);
  const secondMagnitude = formatBasisScalar(Math.abs(coordinates.v2));
  const sign = coordinates.v2 < 0 ? "-" : "+";
  return `${first} v1 ${sign} ${secondMagnitude} v2`;
}

function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function mapXPlane(z, bounds) {
  const pad = Math.min(bounds.width, bounds.height) * 0.075;
  const w = bounds.width - pad * 2;
  const h = bounds.height - pad * 2;
  return {
    x: pad + ((z.re - xView.xmin) / (xView.xmax - xView.xmin)) * w,
    y: pad + ((xView.ymax - z.im) / (xView.ymax - xView.ymin)) * h,
  };
}

function unmapXPlane(point, bounds) {
  const pad = Math.min(bounds.width, bounds.height) * 0.075;
  const w = bounds.width - pad * 2;
  const h = bounds.height - pad * 2;
  return c(
    xView.xmin + ((point.x - pad) / w) * (xView.xmax - xView.xmin),
    xView.ymax - ((point.y - pad) / h) * (xView.ymax - xView.ymin),
  );
}

function makePeriodMapper(bounds) {
  const pad = Math.min(bounds.width, bounds.height) * 0.12;
  const center = c(bounds.width / 2, bounds.height / 2);
  const limit = state.periodLimit;
  const scaleFactor = (Math.min(bounds.width, bounds.height) / 2 - pad) / limit;

  return {
    limit,
    point(z) {
      return {
        x: center.re + z.re * scaleFactor,
        y: center.im - z.im * scaleFactor,
      };
    },
  };
}

function drawGrid(ctx, bounds, mapper, view, step) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.grid;
  ctx.fillStyle = colors.muted;
  ctx.font = "12px Inter, system-ui, sans-serif";

  const xStart = Math.ceil(view.xmin / step) * step;
  for (let x = xStart; x <= view.xmax + 0.0001; x += step) {
    const a = mapper(c(x, view.ymin), bounds);
    const b = mapper(c(x, view.ymax), bounds);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const yStart = Math.ceil(view.ymin / step) * step;
  for (let y = yStart; y <= view.ymax + 0.0001; y += step) {
    const a = mapper(c(view.xmin, y), bounds);
    const b = mapper(c(view.xmax, y), bounds);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 1.35;
  if (view.xmin < 0 && view.xmax > 0) {
    const a = mapper(c(0, view.ymin), bounds);
    const b = mapper(c(0, view.ymax), bounds);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  if (view.ymin < 0 && view.ymax > 0) {
    const a = mapper(c(view.xmin, 0), bounds);
    const b = mapper(c(view.xmax, 0), bounds);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPath(ctx, points, mapper, bounds, options = {}) {
  if (points.length < 2) {
    return;
  }

  const closed = Boolean(options.closed);
  const smooth = options.smooth !== false;
  const screenPoints = points.map((point) => mapper(point, bounds));

  ctx.save();
  ctx.strokeStyle = options.color || colors.ink;
  ctx.lineWidth = options.width || 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = options.alpha ?? 1;
  ctx.setLineDash(options.dash || []);
  ctx.lineDashOffset = options.dashOffset || 0;
  ctx.beginPath();

  if (!smooth || screenPoints.length < 4) {
    ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
    for (let i = 1; i < screenPoints.length; i += 1) {
      ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
    }
    if (closed) {
      ctx.closePath();
    }
  } else if (closed) {
    const last = screenPoints[screenPoints.length - 1];
    const first = screenPoints[0];
    ctx.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2);
    for (let i = 0; i < screenPoints.length; i += 1) {
      const current = screenPoints[i];
      const next = screenPoints[(i + 1) % screenPoints.length];
      ctx.quadraticCurveTo(
        current.x,
        current.y,
        (current.x + next.x) / 2,
        (current.y + next.y) / 2,
      );
    }
    ctx.closePath();
  } else {
    ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
    for (let i = 1; i < screenPoints.length - 1; i += 1) {
      const current = screenPoints[i];
      const next = screenPoints[i + 1];
      ctx.quadraticCurveTo(
        current.x,
        current.y,
        (current.x + next.x) / 2,
        (current.y + next.y) / 2,
      );
    }
    const last = screenPoints[screenPoints.length - 1];
    ctx.lineTo(last.x, last.y);
  }

  ctx.stroke();
  ctx.restore();
}

function drawPoint(ctx, point, mapper, bounds, options = {}) {
  const p = mapper(point, bounds);
  ctx.save();
  ctx.fillStyle = options.color || colors.ink;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, options.radius || 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (options.label) {
    ctx.fillStyle = options.labelColor || colors.ink;
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillText(options.label, p.x + 9, p.y - 9);
  }
  ctx.restore();
}

function drawArrowOnPath(ctx, points, mapper, bounds, fraction, color, closed = false) {
  const segment = pathSegmentAt(points, fraction, closed);
  if (!segment) {
    return;
  }
  const a = mapper(segment.a, bounds);
  const b = mapper(segment.b, bounds);
  drawArrowHead(ctx, a, b, color, 9);
}

function pathSegmentAt(points, fraction, closed) {
  const segments = closed ? points.length : points.length - 1;
  let total = 0;
  const lengths = [];
  for (let i = 0; i < segments; i += 1) {
    const length = distance(points[i], points[(i + 1) % points.length]);
    lengths.push(length);
    total += length;
  }
  const target = total * fraction;
  let seen = 0;
  for (let i = 0; i < segments; i += 1) {
    if (seen + lengths[i] >= target) {
      return { a: points[i], b: points[(i + 1) % points.length] };
    }
    seen += lengths[i];
  }
  return null;
}

function drawArrowHead(ctx, from, to, color, size) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - size * Math.cos(angle - Math.PI / 7),
    to.y - size * Math.sin(angle - Math.PI / 7),
  );
  ctx.lineTo(
    to.x - size * Math.cos(angle + Math.PI / 7),
    to.y - size * Math.sin(angle + Math.PI / 7),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSourceField(ctx, bounds) {
  const center = mapXPlane(state.t, bounds);
  const radiusPoint = mapXPlane(add(state.t, c(sourceField.radius, 0)), bounds);
  const radius = Math.abs(radiusPoint.x - center.x);

  ctx.save();
  ctx.strokeStyle = "rgba(196, 58, 95, 0.20)";
  ctx.fillStyle = "rgba(196, 58, 95, 0.055)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(196, 58, 95, 0.42)";
  ctx.lineWidth = 1.3;
  for (let i = 0; i < 18; i += 1) {
    const theta = (Math.PI * 2 * i) / 18;
    const inner = radius * 0.23;
    const outer = radius * 0.78;
    const a = {
      x: center.x + Math.cos(theta) * inner,
      y: center.y + Math.sin(theta) * inner,
    };
    const b = {
      x: center.x + Math.cos(theta) * outer,
      y: center.y + Math.sin(theta) * outer,
    };
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    drawArrowHead(ctx, a, b, "rgba(196, 58, 95, 0.48)", 5.5);
  }
  ctx.restore();
}

function drawLabel(ctx, label, point, mapper, bounds, color) {
  const p = mapper(point, bounds);
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "800 13px Inter, system-ui, sans-serif";
  ctx.fillText(label, p.x + 8, p.y - 8);
  ctx.restore();
}

function drawProtectedZones(ctx, bounds) {
  ctx.save();
  ctx.fillStyle = protectedZone.color;
  ctx.strokeStyle = protectedZone.stroke;
  ctx.lineWidth = 1.3;
  ctx.setLineDash([5, 5]);
  for (const center of criticalPoints) {
    const p = mapXPlane(center, bounds);
    const edge = mapXPlane(add(center, c(protectedZone.radius, 0)), bounds);
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.abs(edge.x - p.x), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawInitialTMarker(ctx, bounds) {
  const p = mapXPlane(initialT, bounds);

  ctx.save();
  ctx.strokeStyle = "rgba(196, 58, 95, 0.62)";
  ctx.fillStyle = "rgba(196, 58, 95, 0.08)";
  ctx.lineWidth = 1.8;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(196, 58, 95, 0.72)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(p.x - 5, p.y);
  ctx.lineTo(p.x + 5, p.y);
  ctx.moveTo(p.x, p.y - 5);
  ctx.lineTo(p.x, p.y + 5);
  ctx.stroke();

  ctx.fillStyle = colors.rose;
  ctx.font = "800 12px Inter, system-ui, sans-serif";
  ctx.fillText("λ0", p.x + 9, p.y + 18);
  ctx.restore();
}

function drawSharedContourCutLeg(ctx, bounds) {
  const leg = tCutLegToContourOneStart();
  if (!leg.points || leg.points.length < 2) {
    return;
  }

  drawPath(ctx, leg.points, mapXPlane, bounds, {
    color: colors.sharedCut,
    width: 3.4,
    dash: [5, 5],
    dashOffset: 5,
    alpha: 0.95,
    smooth: false,
  });
}

function drawParameterPlane() {
  const bounds = fitCanvas(parameterCanvas);
  const { ctx, width, height } = bounds;
  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, bounds, mapXPlane, xView, 0.25);
  drawProtectedZones(ctx, bounds);
  drawSourceField(ctx, bounds);
  drawInitialTMarker(ctx, bounds);

  drawPath(ctx, state.tCut, mapXPlane, bounds, {
    color: colors.rose,
    width: 2.5,
    dash: [8, 7],
    alpha: 0.72,
    smooth: false,
  });
  drawSharedContourCutLeg(ctx, bounds);
  drawPath(ctx, state.contourOne, mapXPlane, bounds, {
    color: colors.panel,
    width: 8.5,
    smooth: false,
  });
  drawPath(ctx, state.contourTwo, mapXPlane, bounds, {
    color: colors.panel,
    width: 8,
    closed: true,
    smooth: false,
  });
  drawPath(ctx, state.contourOne, mapXPlane, bounds, {
    color: colors.teal,
    width: 3.2,
    smooth: false,
  });
  drawPath(ctx, state.contourTwo, mapXPlane, bounds, {
    color: colors.orange,
    width: 3,
    closed: true,
    smooth: false,
  });

  drawArrowOnPath(ctx, state.contourOne, mapXPlane, bounds, 0.55, colors.teal);
  drawArrowOnPath(ctx, state.contourTwo, mapXPlane, bounds, 0.15, colors.orange, true);
  drawArrowOnPath(ctx, state.contourTwo, mapXPlane, bounds, 0.68, colors.orange, true);

  drawPath(ctx, state.branch01, mapXPlane, bounds, {
    color: colors.violet,
    width: 2.6,
    dash: [10, 8],
    smooth: false,
  });

  drawPoint(ctx, leftBranch, mapXPlane, bounds, { label: "0", color: colors.ink });
  drawPoint(ctx, rightBranch, mapXPlane, bounds, { label: "1", color: colors.ink });
  drawPoint(ctx, state.t, mapXPlane, bounds, {
    label: "λ",
    color: colors.rose,
    radius: state.dragging || state.hoverHandle ? 8 : 6.5,
  });
  drawLabel(ctx, "γ", state.contourOne[Math.floor(state.contourOne.length * 0.42)], mapXPlane, bounds, colors.teal);
  drawLabel(ctx, "δ", state.contourTwo[Math.floor(state.contourTwo.length * 0.63)], mapXPlane, bounds, colors.orange);
}

function screenVector(mapper, vector) {
  const origin = mapper.point(c(0, 0));
  const end = mapper.point(vector);
  return {
    x: end.x - origin.x,
    y: end.y - origin.y,
  };
}

function addScreenPoint(point, vector, scaleFactor = 1) {
  return {
    x: point.x + vector.x * scaleFactor,
    y: point.y + vector.y * scaleFactor,
  };
}

function drawPeriodLattice(ctx, bounds, mapper, periodOne, periodTwo) {
  const origin = mapper.point(c(0, 0));
  const a = screenVector(mapper, periodOne);
  const b = screenVector(mapper, periodTwo);
  const aLength = Math.hypot(a.x, a.y);
  const bLength = Math.hypot(b.x, b.y);
  const determinant = a.x * b.y - a.y * b.x;
  const area = Math.abs(determinant);

  if (aLength < 2 || bLength < 2 || area < 20) {
    return;
  }

  const margin = 28;
  const corners = [
    { x: -margin, y: -margin },
    { x: bounds.width + margin, y: -margin },
    { x: bounds.width + margin, y: bounds.height + margin },
    { x: -margin, y: bounds.height + margin },
  ];
  let minM = Infinity;
  let maxM = -Infinity;
  let minN = Infinity;
  let maxN = -Infinity;

  for (const corner of corners) {
    const dx = corner.x - origin.x;
    const dy = corner.y - origin.y;
    const m = (dx * b.y - dy * b.x) / determinant;
    const n = (a.x * dy - a.y * dx) / determinant;
    minM = Math.min(minM, m);
    maxM = Math.max(maxM, m);
    minN = Math.min(minN, n);
    maxN = Math.max(maxN, n);
  }

  const mStart = Math.max(-80, Math.floor(minM) - 2);
  const mEnd = Math.min(80, Math.ceil(maxM) + 2);
  const nStart = Math.max(-80, Math.floor(minN) - 2);
  const nEnd = Math.min(80, Math.ceil(maxN) + 2);

  ctx.save();
  ctx.fillStyle = "rgba(23, 32, 51, 0.24)";
  for (let m = mStart; m <= mEnd; m += 1) {
    for (let n = nStart; n <= nEnd; n += 1) {
      const point = addScreenPoint(addScreenPoint(origin, a, m), b, n);
      if (
        point.x < -margin
        || point.x > bounds.width + margin
        || point.y < -margin
        || point.y > bounds.height + margin
      ) {
        continue;
      }

      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawVector(ctx, mapper, vector, color, label, offset, options = {}) {
  const origin = mapper.point(c(0, 0));
  const end = mapper.point(vector);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = options.width || 4;
  ctx.lineCap = "round";
  ctx.globalAlpha = options.alpha ?? 1;
  ctx.setLineDash(options.dash || []);
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  if (options.arrow !== false) {
    drawArrowHead(ctx, origin, end, color, options.arrowSize || 12);
  }
  if (label) {
    ctx.fillStyle = color;
    ctx.font = options.font || "800 13px Inter, system-ui, sans-serif";
    ctx.fillText(label, end.x + offset.x, end.y + offset.y);
  }
  ctx.restore();
}

function drawPeriodPlane() {
  const bounds = fitCanvas(periodCanvas);
  const { ctx, width, height } = bounds;
  ctx.clearRect(0, 0, width, height);
  const mapper = makePeriodMapper(bounds);

  const origin = mapper.point(c(0, 0));
  const p1 = state.periods[0];
  const p2 = state.periods[1];
  const r1 = state.referencePeriods[0];
  const r2 = state.referencePeriods[1];
  drawPeriodLattice(ctx, bounds, mapper, p1, p2);

  drawVector(ctx, mapper, r1, colors.teal, "v1", { x: 8, y: -8 }, {
    dash: [8, 7],
    width: 2.4,
    alpha: 0.52,
    arrowSize: 9,
    font: "700 11px Inter, system-ui, sans-serif",
  });
  drawVector(ctx, mapper, r2, colors.orange, "v2", { x: 8, y: 16 }, {
    dash: [8, 7],
    width: 2.4,
    alpha: 0.52,
    arrowSize: 9,
    font: "700 11px Inter, system-ui, sans-serif",
  });
  drawVector(ctx, mapper, p1, colors.teal, "Iγ", { x: 8, y: -8 });
  drawVector(ctx, mapper, p2, colors.orange, "Iδ", { x: 8, y: 16 });

  ctx.save();
  ctx.fillStyle = colors.ink;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function draw() {
  drawParameterPlane();
  drawPeriodPlane();
}

function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function pointerNearHandle(event) {
  const bounds = {
    width: parameterCanvas.getBoundingClientRect().width,
    height: parameterCanvas.getBoundingClientRect().height,
  };
  const cursor = canvasPoint(event, parameterCanvas);
  const handle = mapXPlane(state.t, bounds);
  return Math.hypot(cursor.x - handle.x, cursor.y - handle.y) <= 18;
}

function dragTargetFromEvent(event) {
  const bounds = {
    width: parameterCanvas.getBoundingClientRect().width,
    height: parameterCanvas.getBoundingClientRect().height,
  };
  return unmapXPlane(canvasPoint(event, parameterCanvas), bounds);
}

function runQueuedDragMove() {
  state.dragFrame = null;
  if (!state.dragging || !state.pendingDragTarget) {
    state.pendingDragTarget = null;
    return;
  }

  const target = state.pendingDragTarget;
  state.pendingDragTarget = null;
  moveT(target);
}

function scheduleDragMove(target) {
  state.pendingDragTarget = target;
  if (state.dragFrame) {
    return;
  }
  state.dragFrame = requestAnimationFrame(runQueuedDragMove);
}

function flushQueuedDragMove(target = null) {
  if (target) {
    state.pendingDragTarget = target;
  }
  if (state.dragFrame) {
    cancelAnimationFrame(state.dragFrame);
    state.dragFrame = null;
  }
  if (!state.pendingDragTarget) {
    return;
  }

  const queuedTarget = state.pendingDragTarget;
  state.pendingDragTarget = null;
  moveT(queuedTarget);
}

parameterCanvas.addEventListener("pointerdown", (event) => {
  if (!pointerNearHandle(event)) {
    return;
  }
  state.dragging = true;
  state.pendingDragTarget = null;
  parameterCanvas.classList.add("dragging");
  parameterCanvas.setPointerCapture(event.pointerId);
});

parameterCanvas.addEventListener("pointermove", (event) => {
  if (state.dragging) {
    scheduleDragMove(dragTargetFromEvent(event));
    return;
  }

  const hovering = pointerNearHandle(event);
  if (hovering !== state.hoverHandle) {
    state.hoverHandle = hovering;
    drawParameterPlane();
  }
});

function endDrag(event) {
  if (!state.dragging) {
    return;
  }
  flushQueuedDragMove(dragTargetFromEvent(event));
  state.dragging = false;
  parameterCanvas.classList.remove("dragging");
  if (parameterCanvas.hasPointerCapture(event.pointerId)) {
    parameterCanvas.releasePointerCapture(event.pointerId);
  }
  if (state.periodUpdatePending) {
    updatePeriods();
  }
  draw();
}

parameterCanvas.addEventListener("pointerup", endDrag);
parameterCanvas.addEventListener("pointercancel", endDrag);
parameterCanvas.addEventListener("pointerleave", (event) => {
  if (!state.dragging && state.hoverHandle) {
    state.hoverHandle = false;
    drawParameterPlane();
  }
  if (state.dragging && event.buttons === 0) {
    endDrag(event);
  }
});

resetButton.addEventListener("click", () => {
  createBaseState();
  draw();
});

dynamicPeriodUpdatesToggle.addEventListener("change", () => {
  setDynamicPeriodUpdates(dynamicPeriodUpdatesToggle.checked);
});

window.addEventListener("resize", draw);

createBaseState();
setDynamicPeriodUpdateControl();
draw();
