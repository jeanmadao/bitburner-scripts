import { NS } from "@ns"
import { buyServer } from "./lib/helpers"
import { solveAllContracts } from "lib/contracts"

export async function main(ns: NS): Promise<void> {
  solveAllContracts(ns)
  //while(buyServer(ns)) {
  //  await ns.sleep(1000)
  //}
}
