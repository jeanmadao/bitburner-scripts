import { NS } from "@ns"
import { crackServer, scanDeep, buyServer, upgradeServers } from "lib/helpers"
import { solveAllContracts } from "./lib/contracts"


export async function main(ns: NS): Promise<void> {
  const scriptName = "basic-hack.js"
  while (true) {
    //solveAllContracts(ns)
    //upgradeServers(ns)
    const hosts = scanDeep(ns)
    const crackedHosts = [...ns.getPurchasedServers()]
    let targetServer = null

    for (const host of hosts) {
      if (crackServer(ns, host)) {
        crackedHosts.push(host)

        const maxMoney = ns.getServerMaxMoney(host)
        if (!targetServer || targetServer.maxMoney < maxMoney)
          targetServer = { host, maxMoney }
      }
    }

    if (targetServer) {
      ns.toast(`Target: ${targetServer.host} MaxMoney: ${targetServer.maxMoney}`, "info")
      let botnets = []

      for (const host of crackedHosts) {
        ns.scp(scriptName, host)
        let threads
        if (host === "home") 
          threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - 40) / ns.getScriptRam(scriptName))
        else 
          threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(scriptName))
        if (threads > 0){
          if (ns.exec(scriptName, host, threads, targetServer.host) !== 0)
            botnets.push(host)
          else
            ns.tprint(`${host}`)
        }
      }
      ns.toast(`Deploying on ${botnets.length} servers`, "info")

      let stop = true
      while (stop) {
        stop = false
        let i = 0
        while (!stop && i < botnets.length) {
          if (ns.scriptRunning(scriptName, botnets[i])) {
            stop = true
          }
          i = i + 1
        }
        await ns.sleep(10000)
      }
      ns.toast("All scripts finished!", "success")
    }


  }
}
