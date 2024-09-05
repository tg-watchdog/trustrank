/// <reference path="../src/types.d.ts" />

import trustrank from '../src'

// User list
let userList = [] as User[]
// Trust list
let trustList = [] as Trust[]

// Trust algorithem
async function trust(from: number, to: number): Promise<Boolean> {
  if (from === to) return false
  if (userList[from].isAbuse) return false
  if (userList[to].isAbuse) return false
  if (trustList.filter(t => t.from === from && t.to === to).length > 0) return false

  // write trust relationship
  trustList.push({ from, to })

  // re-calculate trust rank for trustee
  let newTrustList4Trustee: {
    trustRank: number;
    otherTrustee: number;
  }[] = []
  for (let i in trustList) {
    if (trustList[i].to === to) {
      newTrustList4Trustee.push({
        trustRank: userList[trustList[i].from].trustRank,
        otherTrustee: trustList.filter(t => t.from === trustList[i].from).length - 1
      })
    }
  }
  userList[to].trustRank = trustrank.calculateTrustRank(newTrustList4Trustee)
  return true
}

async function main() {
  // Generate some random users
  for (let i = 0; i < 100; i++) {
    const userScore = 0.1
    const isAd = Math.random() < 0.1
    userList.push({ id: i, trustRank: userScore, isAbuse: isAd })
  }

  // Select one random user to trust another random user
  // Execute 1000 times
  for (let i = 0; i < 1000; i++) {
    console.log(`Round ${i}`)
    const from = Math.floor(Math.random() * 100)
    const to = Math.floor(Math.random() * 100)
    if (await trust(from, to)) {
      console.log(`User ${from} has trusted user ${to}`)
      console.log(`New trust rank of user ${to}: ${userList[to].trustRank}`)
    } else {
      console.log(`User ${from} failed to trust user ${to}`)
    }
  }

  // Print the final trust rank of all users
  console.log(`Maxium TrustRank: ${Math.max(...userList.map(u => u.trustRank))}`)
  console.log(`Minium TrustRank: ${Math.min(...userList.map(u => u.trustRank))}`)
  console.log(`Average TrustRank: ${userList.reduce((s, u) => s + u.trustRank, 0) / userList.length}`)
}

main()