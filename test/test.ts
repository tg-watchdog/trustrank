/// <reference path="../src/types.d.ts" />

import trustrank from '../src'

// User list
let userList = [] as User[]
// Trust list
let voteList = [] as Vote[]

// Vote algorithem
async function vote(voterId: number, voteeId: number, trust: boolean): Promise<Boolean> {
  if (voterId === voteeId) return false
  if (!userList[voterId] || !userList[voteeId]) return false
  if (voteList.find(v => v.voter === voterId && v.votee === voteeId)) return false
  let voter = userList[voterId]
  if (voter.trustRank < 0) return false

  // Add vote
  voteList.push({ voter: voterId, votee: voteeId, trust })

  // Recalculate TrustRank
  let votesToTargetVotee = voteList.filter(v => {
    // a valid vote:
    // 1. votee is the target votee
    // 2. voter's trustRank is positive

    return v.votee === voteeId && userList[v.voter].trustRank > 0
  }).map(v => {
    return { trust: v.trust, trustRank: userList[v.voter].trustRank, otherVotes: (voteList.filter(v2 => v2.votee === v.votee).length <= 0) ? 1 : voteList.filter(v2 => v2.votee === v.votee).length }
  })
  let newTR = trustrank.calculateTrustRank(votesToTargetVotee)
  userList[voteeId].trustRank = newTR
  return true
}

async function main() {
  // Create normal users
  for (let i = 0; i < 1000; i++) {
    userList.push({ id: i, trustRank: 0.00067 })
  }
  // Create abuser
  for (let i = 1000; i < 1500; i++) {
    userList.push({ id: i, trustRank: 0.00067 })
  }

  // Simulate voting
  for (let i in Array(10000).fill(0)) {
    // generate random voter
    let voter = Math.floor(Math.random() * 150)
    if (voter < 100) {
      // randomly choose a votee
      let votee = Math.floor(Math.random() * 150)
      if (votee < 100) await vote(voter, votee, true)
      else await vote(voter, votee, false)
    } else {
      // randomly choose a abuser and vote trust
      let votee = Math.floor(Math.random() * 50) + 100
      await vote(voter, votee, true)
    }
  }

  // Print the result
  console.log(`Maxium trustRank: ${Math.max(...userList.map(u => u.trustRank))}`)
  console.log(`Minium trustRank: ${Math.min(...userList.map(u => u.trustRank))}`)
  console.log(`Average trustRank: ${userList.reduce((a, b) => a + b.trustRank, 0) / userList.length}`)
  console.log(`Maxium TR of normal user: ${Math.max(...userList.filter(u => u.id < 100).map(u => u.trustRank))}`)
  console.log(`Minium TR of normal user: ${Math.min(...userList.filter(u => u.id < 100).map(u => u.trustRank))}`)
  console.log(`Average TR of normal user: ${userList.filter(u => u.id < 100).reduce((a, b) => a + b.trustRank, 0) / userList.filter(u => u.id < 100).length}`)
  console.log(`Maxium TR of abuser: ${Math.max(...userList.filter(u => u.id >= 100).map(u => u.trustRank))}`)
  console.log(`Minium TR of abuser: ${Math.min(...userList.filter(u => u.id >= 100).map(u => u.trustRank))}`)
  console.log(`Average TR of abuser: ${userList.filter(u => u.id >= 100).reduce((a, b) => a + b.trustRank, 0) / userList.filter(u => u.id >= 100).length}`)
  console.log(`Abusers have positive TR: ${userList.filter(u => u.id >= 100 && u.trustRank > 0).length}`)
}

main()