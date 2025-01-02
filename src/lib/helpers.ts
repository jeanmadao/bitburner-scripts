import { NS } from "@ns"

type SoftwareName = "BruteSSH.exe" | "FTPCrack.exe" | "relaySMTP.exe" | "HTTPWorm.exe" | "SQLInject.exe"

interface Software {
  name: SoftwareName
  exe: (host: string) => void
}

const scanDeep = (ns: NS): string[] => {
  let queue = ns.scan("home")
  let hosts = ["home", ...queue]
  while (queue.length > 0) {
    const current = queue.pop()
    const newNeighbors = ns.scan(current).filter(neighbor => !hosts.includes(neighbor))
    hosts = hosts.concat(newNeighbors)
    queue = newNeighbors.concat(queue)
  }
  return hosts
}

const crackServer = (ns: NS, host: string): boolean => {
  const softwares: Software[] = [
    { name: "BruteSSH.exe", exe: ns.brutessh },
    { name: "FTPCrack.exe", exe: ns.ftpcrack },
    { name: "relaySMTP.exe", exe: ns.relaysmtp },
    { name: "HTTPWorm.exe", exe: ns.httpworm },
    { name: "SQLInject.exe", exe: ns.sqlinject },
  ]

  let cracked = false

  if (host === "home") {
    cracked = true
  } else {
    let portsOpened = 0
    for (const software of softwares) {
      if (ns.fileExists(software.name, "home")) {
        software.exe(host)
        portsOpened++
      }
    }

    if (portsOpened >= ns.getServerNumPortsRequired(host)) {
      ns.nuke(host)
      if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host))
        cracked = true
    }
  }

  return cracked 
}

const scpToHome = (ns: NS, host: string) => {
  const files = ns.ls(host, ".lit")
  ns.scp(files, "home", host)
  for (const file of files) {
    ns.mv("home", file, `lit/${file}`)
  }
}

const buyServer = (ns: NS): boolean => {
  const purchasedServers = ns.getPurchasedServers()
  const ram = 8
  const nbPurchasedServers = purchasedServers.length
  let purchased = false
  if (nbPurchasedServers < ns.getPurchasedServerLimit() && ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)) {
    const serverName = `archmadao-${String(nbPurchasedServers).padStart(2, '0')}`
    ns.purchaseServer(serverName, ram)
    purchased = true
    ns.toast(`Bought ${serverName}`, "success")
  }

  return purchased
}

const nameServers = (ns: NS): void => {
  const purchasedServers = ns.getPurchasedServers()
  for (let i=0; i < purchasedServers.length; i++) {
    const currentServer = purchasedServers[i]
    const serverName = `archmadao-${String(i).padStart(2, '0')}-${ns.getServerMaxRam(purchasedServers[i])}GB`
    ns.renamePurchasedServer(currentServer, serverName)
  }
}

const upgradeServers = (ns: NS): void => {
  const purchasedServers = ns.getPurchasedServers()
  const nbPurchasedServers = purchasedServers.length
  let targetRam = Math.min(...purchasedServers.map(server => ns.getServerMaxRam(server))) * 2
  let enoughMoney = true
  while (enoughMoney && targetRam <= ns.getPurchasedServerMaxRam()) {
    let i = 0
    while (enoughMoney && i < nbPurchasedServers) {
      const currentServer = purchasedServers[i]
      if (ns.getServerMaxRam(currentServer) < targetRam) {
        if (ns.getPurchasedServerUpgradeCost(currentServer, targetRam) <= ns.getServerMoneyAvailable("home")) {

          ns.upgradePurchasedServer(currentServer, targetRam)
          const newServerName = `archmadao-${String(i).padStart(2, '0')}-${targetRam}GB`
          ns.renamePurchasedServer(currentServer, newServerName)
        }
        else
          enoughMoney = false
      }
      i += 1
    }
    targetRam = targetRam * 2
  }
}

export { scanDeep, crackServer, buyServer, nameServers, upgradeServers }
