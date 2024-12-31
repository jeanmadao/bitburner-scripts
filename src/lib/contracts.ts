import { NS } from "@ns"
import { scanDeep } from "lib/helpers"

interface Coordinates {
  i: number,
  j: number,
}

interface Position {
  coord: Coordinates,
  path: string,
}

type DirectionDelta = 0 | 1 | -1

type DirectionChar = 'R' | 'D' | 'L' | 'U'

interface Direction {
  i: DirectionDelta,
  j: DirectionDelta,
  char: DirectionChar
}

const find_largest_prime_factor = (value: number): number => {
  let prime = 2
  while (value > 1) {
    if (value % prime == 0)
      value = value / prime
    else
      prime += 1
  }
  return prime
}

const total_ways_sum_ii = (data: [number, number[]], ns: NS) => {
  const n = data[0]
  const s = data[1]

  ns.tprint(`${s}`)

  const recursion = (value: number, total=0, depth=0) => {
    depth = depth + 1
    if (value === 0) {
      total = total + 1
      ns.tprint(`${total}`)
      //await ns.sleep(1000000)
    } else if (value > 0 && depth < 8) {
      for (const nb of s) {
        ns.tprint(`${value} - ${nb}, depth: ${depth}`)
        total = recursion(value - nb, total, depth)
      }
    }
    return total
  }
  const res = recursion(n)
  ns.tprint(`res: ${res}`)
  return res
}

const spiralize_matrix = (matrix: number[][], ns: NS): number[] => {

}

const unique_paths_in_a_grid_ii = (grid: number[][], ns: NS): number => {
  const directions: Direction[] = [
    { i: 0, j: 1, char: "R"},
    { i: 1, j: 0, char: "D"},
  ]
  const height = grid.length
  const width = grid[0].length
  const root_coord = { i: 0, j: 0 }
  const target_coord = { i: height - 1, j: width - 1 }
  const queue: Coordinates[] = [root_coord]

  let total = 0

  while (queue.length > 0) {
    const curr = queue.pop() as Coordinates
    for (const direction of directions) {
      const new_coord = {
        i: curr.i + direction.i,
        j: curr.j + direction.j,
      }

      if (0 <= new_coord.i && new_coord.i < height
          && 0 <= new_coord.j && new_coord.j < width
          && grid[new_coord.i][new_coord.j] == 0) {

        if (new_coord.i === target_coord.i && new_coord.j === target_coord.j) {
          total += 1
        } else {
          queue.unshift(new_coord)
        }
      }
    }
  }
  return total 
}

const shortest_path_in_a_grid = (grid: number[][]): string => {
  const directions: Direction[] = [
    { i: 0, j: 1, char: "R"},
    { i: 1, j: 0, char: "D"},
    { i: 0, j: -1, char: "L" },
    { i: -1, j: 0, char: "U" }
  ]

  const height = grid.length
  const width = grid[0].length
  const root_coord = { i: 0, j: 0 }
  const target_coord = { i: height - 1, j: width - 1 }
  const queue: Position[] = [{ coord: root_coord, path: "" }]
  let found = false
  let path = ""

  while (!found && queue.length > 0) {
    const curr = queue.pop() as Position
    grid[curr.coord.i][curr.coord.j] = -1
    for (const direction of directions) {
      const new_coord = {
        i: curr.coord.i + direction.i,
        j: curr.coord.j + direction.j,
      }

      if (0 <= new_coord.i && new_coord.i < height
          && 0 <= new_coord.j && new_coord.j < width
          && grid[new_coord.i][new_coord.j] == 0) {

        const new_path = curr.path + direction.char

        const new_pos = {
          coord: new_coord,
          path: new_path
        }

        if (new_coord.i === target_coord.i && new_coord.j === target_coord.j) {
          found = true
          path = new_path
        } else {
          queue.unshift(new_pos)
        }
      }
    }
  }

  return path
}

const solvers = [
  { name: "Find Largest Prime Factor", func: find_largest_prime_factor }, //95
  //{ name: "Total Ways to Sum II", func: total_ways_sum_ii }, //198
  //{ name: "Spiralize Matrix", func: spiralize_matrix }, //271
  { name: "Unique Paths in a Grid II", func: unique_paths_in_a_grid_ii }, //892
  { name: "Shortest Path in a Grid", func: shortest_path_in_a_grid }, //916
]

const solveContract = (ns: NS, filename: string, host: string) => {
  ns.tprint(`INFO: ${filename} ${host}`)
  const contractType = ns.codingcontract.getContractType(filename, host)
  ns.tprint(`${contractType}`)
  const description = ns.codingcontract.getDescription(filename, host)
  ns.tprint(`${description}`)
  const data = ns.codingcontract.getData(filename, host)
  ns.tprint(`${data} ${typeof(data)}`)
  const solver = solvers.find(solver => solver.name === contractType)
  if (solver) {
    if (contractType === "Spiralize Matrix") {
      spiralize_matrix(data, ns)
    } else {
      //const reward = ns.codingcontract.attempt(solver.func(data), filename, host)
      //if (reward) {
      //  ns.tprint(`SUCCESS: "${contractType}" on ${host}@${filename} solved successfully! Reward: ${reward}`);
      //} else {
      //  ns.tprint(`WARN: Failed to solve "${contractType}" on ${host}@${filename}.`);
      //}
    }
  }
}

const solveAllContracts = (ns: NS) => {
  const hosts = scanDeep(ns)
  for (const host of hosts) {
    const contracts = ns.ls(host, ".cct")
    for (const contract of contracts) {
      solveContract(ns, contract, host)
    }
  }
}

export { solveAllContracts }
