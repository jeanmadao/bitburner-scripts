import { NS } from "@ns"
import { nameServers, buyServer, upgradeServers } from "./lib/helpers"
import { solveAllContracts } from "lib/contracts"

export async function main(ns: NS): Promise<void> {
  solveAllContracts(ns)
  //ns.toast(`${ns.getPurchasedServerMaxRam()}`, "info")
  //while(buyServer(ns)) {
  //  await ns.sleep(1000)
  //}
  //upgradeServers(ns)
  //nameServers(ns)
}
