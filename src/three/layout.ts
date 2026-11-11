const LEFT_XS = [-1.0, -0.65, -0.3]
const RIGHT_XS = [0.3, 0.65, 1.0]
const ROW_ZS = [-0.35, 0.35]
const SLOT_Y = 1.02

const SLOTS: [number, number, number][] = ROW_ZS.flatMap((z) =>
  [...LEFT_XS, ...RIGHT_XS].map((x): [number, number, number] => [x, SLOT_Y, z]),
)

export function computeTableSlots(n: number): [number, number, number][] {
  return SLOTS.slice(0, n)
}

export const BOWL_LOCAL_POSITION: [number, number, number] = [0, 1.08, 0]
