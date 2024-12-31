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

  let portsOpened = 0
  let hackable = false

  for (const software of softwares) {
    if (ns.fileExists(software.name, "home")) {
      software.exe(host)
      portsOpened++
    }
  }

  if (portsOpened >= ns.getServerNumPortsRequired(host)) {
    ns.nuke(host)
    if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host))
      hackable = true
  }

  return hackable 
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

export { scanDeep, crackServer, buyServer }
