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

interface PathSum {
  coord: Coordinates,
  sum: number
}

type DirectionDelta = 0 | 1 | -1

type DirectionChar = 'R' | 'D' | 'L' | 'U'

interface Direction {
  i: DirectionDelta,
  j: DirectionDelta,
  char: DirectionChar
}


interface Solver {
  name: string,
  func: (data: any) => string | number[] | any
}

const findLargestPrimeFactor = (value: number): number => {
  let prime = 2
  while (value > 1) {
    if (value % prime == 0)
      value = value / prime
    else
      prime += 1
  }
  return prime
}

const totalWaysToSumII = (data: [number, number[]], ns: NS) => {
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

const spiralizeMatrix = (matrix: number[][], ns: NS): number[] => {
  return [0]
}

const algorithmicStockTraderIII = (data: number[]): number => {
  return 1
}

const minimumPathSumInATriangle = (pyramid: number[][]): number => {
  const height = pyramid.length
  const root: PathSum = { 
    coord: { i: 0, j: 0},
    sum: pyramid[0][0]
  }
  let queue = [root]
  while ((queue.at(-1) as PathSum).coord.i + 1 < height) {
    const current = queue.pop() as PathSum
    const adjacents = [
      {
        coord: { i: current.coord.i + 1, j: current.coord.j },
        sum: current.sum + pyramid[current.coord.i + 1][current.coord.j]
      },
      {
        coord: { i: current.coord.i + 1, j: current.coord.j + 1 },
        sum: current.sum + pyramid[current.coord.i + 1][current.coord.j + 1]
      },
    ]
    queue = adjacents.concat(queue)
  }
  const sums = queue.map(pathSum => pathSum.sum)
  return Math.min(...sums)
}

const uniquePathsInAGridII = (grid: number[][]): number => {
  const directions: Direction[] = [
    { i: 0, j: 1, char: "R"},
    { i: 1, j: 0, char: "D"},
  ]
  const height = grid.length
  const width = grid[0].length
  const rootCoord = { i: 0, j: 0 }
  const targetCoord = { i: height - 1, j: width - 1 }
  const queue: Coordinates[] = [rootCoord]

  let total = 0

  while (queue.length > 0) {
    const curr = queue.pop() as Coordinates
    for (const direction of directions) {
      const newCoord = {
        i: curr.i + direction.i,
        j: curr.j + direction.j,
      }

      if (0 <= newCoord.i && newCoord.i < height
          && 0 <= newCoord.j && newCoord.j < width
          && grid[newCoord.i][newCoord.j] == 0) {

        if (newCoord.i === targetCoord.i && newCoord.j === targetCoord.j) {
          total += 1
        } else {
          queue.unshift(newCoord)
        }
      }
    }
  }
  return total 
}

const shortestPathInAGrid = (grid: number[][]): string => {
  const directions: Direction[] = [
    { i: 0, j: 1, char: "R"},
    { i: 1, j: 0, char: "D"},
    { i: 0, j: -1, char: "L" },
    { i: -1, j: 0, char: "U" }
  ]

  const height = grid.length
  const width = grid[0].length
  const rootCoord = { i: 0, j: 0 }
  const targetCoord = { i: height - 1, j: width - 1 }
  const queue: Position[] = [{ coord: rootCoord, path: "" }]
  let found = false
  let path = ""

  while (!found && queue.length > 0) {
    const curr = queue.pop() as Position
    grid[curr.coord.i][curr.coord.j] = -1
    for (const direction of directions) {
      const newCoord = {
        i: curr.coord.i + direction.i,
        j: curr.coord.j + direction.j,
      }

      if (0 <= newCoord.i && newCoord.i < height
          && 0 <= newCoord.j && newCoord.j < width
          && grid[newCoord.i][newCoord.j] == 0) {

        const newPath = curr.path + direction.char

        const newPos = {
          coord: newCoord,
          path: newPath
        }

        if (newCoord.i === targetCoord.i && newCoord.j === targetCoord.j) {
          found = true
          path = newPath
        } else {
          queue.unshift(newPos)
        }
      }
    }
  }

  return path
}

const findAllValidMathExpressions = (data: [string, number]): string[] => {
  const baseString = data[0]
  const target = data[1]
  const validExpressions = []

  const operators = ['+', '-', '*', '']
  const base = operators.length
  const nbOperators = baseString.length - 1
  let combination = 0
  while (combination < operators.length**nbOperators) {
    let expression = baseString[0]
    for (let i=0; i < nbOperators; i++) {
      const operator = operators[Math.floor(combination / base**i) % base]
      if (operator === '' && expression.at(-1) === '0')
        expression = expression.substring(0, expression.length - 1)
      expression = expression + operator + baseString[i + 1]
    }
    if (eval(expression) === target)
      validExpressions.push(expression)
    combination += 1
  }
  return validExpressions
}

const compressionIRLECompression = (plaintext: string): string => {
  let i = 0
  const plaintextLength = plaintext.length
  let compressed = ""
  while (i < plaintextLength) {
    const char = plaintext[i]
    let runLength = 1
    while (i + runLength < plaintextLength && runLength < 9 && plaintext[i + runLength] === char)
      runLength = runLength + 1
    compressed = compressed.concat(`${runLength}${char}`)
    i = i + runLength
  }

  return compressed
}

const compressionIILZDecompression = (compressed: string): string => {
  let decompressed = ""
  let i = 0
  let chunkType = 0
  const length = compressed.length
  while (i < length) {
    const l = parseInt(compressed[i])
    if (l !== 0) {
      let chunk = ""
      switch(chunkType) {
        case 0:
          chunk = compressed.substring(i + 1, i + 1 + l)
          i = i + l
          break
        case 1:
          const x = parseInt(compressed[i + 1])
          const decompressedLength = decompressed.length
          chunk = decompressed.substring(decompressedLength - x).repeat(Math.floor(l / x)) +
            decompressed.substring(decompressedLength - x, decompressedLength - x + l % x)
          i = i + 1
          break
      }
      decompressed = decompressed.concat(chunk)
    }
    i = i + 1
    chunkType = (chunkType + 1) % 2
  }

  return decompressed
}

const solvers: Solver[] = [
  { name: "Find Largest Prime Factor", func: findLargestPrimeFactor }, //95
  //{ name: "Total Ways to Sum II", func: totalWaysToSumII }, //198
  //{ name: "Spiralize Matrix", func: spiralizeMatrix }, //271
  //{ name: "Algorithmic Stock Trader III", func: algorithmicStockTraderIII }, //651
  { name: "Minimum Path Sum in a Triangle", func: minimumPathSumInATriangle }, //789
  { name: "Unique Paths in a Grid II", func: uniquePathsInAGridII }, //892
  { name: "Shortest Path in a Grid", func: shortestPathInAGrid }, //916
  { name: "Find All Valid Math Expressions", func: findAllValidMathExpressions }, //1192
  { name: "Compression I: RLE Compression", func: compressionIRLECompression }, //1486
  { name: "Compression II: LZ Decompression", func: compressionIILZDecompression }, //1564
]

const solveContract = (ns: NS, filename: string, host: string): void => {
  ns.tprint(`INFO: ${filename} ${host}`)
  const contractType = ns.codingcontract.getContractType(filename, host)
  ns.tprint(`${contractType}`)
  const description = ns.codingcontract.getDescription(filename, host)
  ns.tprint(`${description}`)
  const data = ns.codingcontract.getData(filename, host)
  ns.tprint(`${data} ${typeof(data)}`)
  const solver = solvers.find(solver => solver.name === contractType)
  //if (contractType === "Find All Valid Math Expressions") {
  //  ns.tprint(findAllValidMathExpressions(["123", 6], ns))
  //  ns.tprint(findAllValidMathExpressions(["105", 6], ns))
  //}
  if (solver) {
    const reward = ns.codingcontract.attempt(solver.func(data), filename, host)
    if (reward) {
      const successMessage = `"${contractType}" on ${host}@${filename} solved successfully! Reward: ${reward}`
      ns.tprint(`SUCCESS: ${successMessage}`);
      ns.toast(successMessage, "success")
    } else {
      const failureMessage = `Failed to solve "${contractType}" on ${host}@${filename}.`
      ns.tprint(`WARN: ${failureMessage}`);
      ns.toast(failureMessage, "error")
    }
  }
}

const solveAllContracts = (ns: NS): void => {
  const hosts = scanDeep(ns)
  for (const host of hosts) {
    const contracts = ns.ls(host, ".cct")
    for (const contract of contracts) {
      solveContract(ns, contract, host)
    }
  }
}

export { solveAllContracts }
