import { NS } from "@ns"
import { crackServer, scanDeep, buyServer } from "lib/helpers"


export async function main(ns: NS): Promise<void> {
  const scriptName = "basic-hack.js"

  while (true) {
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
      //ns.tprint(`INFO: Deploying on ${crackedHosts.length} different servers: ${crackedHosts.join()}`)
      //ns.tprint(`INFO: Target: ${targetServer.host} MaxMoney: ${targetServer.maxMoney}`)

      for (const host of crackedHosts){
        //ns.tprint(`INFO: ${host}`)
        ns.scp(scriptName, host)
        ns.exec(scriptName, host, Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(scriptName)), targetServer.host)
      }
    }

    let stop = true 
    while (stop) {
      let i = 0
      while (stop && i < crackedHosts.length) {
        if (!ns.scriptRunning(scriptName, crackedHosts[i])) {
          stop = false
          //ns.tprint(`INFO: Scripts are all cleared!`)
        }
        i++
      }
      await ns.sleep(10000)
    }
  }
}
