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

  // If voter has negative trustRank, the vote will be invalid
  if (voter.trustRank < 0) return false
  // If voter has already voted 5 trust to other users, the vote will be invalid
  if (voteList.filter(v => { v.voter === voterId && v.trust }).length >= 5) return false

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
  for (let i = 0; i < 100; i++) {
    userList.push({ id: i, trustRank: 0.1, spam: false })
  }

  // Action rounds
  for (let i = 0; i < 10000; i++) {
    // Create 1 normal user: 20% chance
    if (Math.random() < 0.2) userList.push({ id: userList.length, trustRank: 0.01, spam: false })
    // Create 5 abusers: 2% chance
    if (Math.random() < 0.02) for (let j = 0; j < 5; j++) userList.push({ id: userList.length, trustRank: 0.01, spam: true })

    // 5 random normal user vote 1 spam user: 50% chance
    if (Math.random() < 0.5) {
      await normalVoteSpams()
    }

    // Purchase trust votes: 2% chance for 1 spam user purchased 5 trust votes from other spam users
    if (Math.random() < 0.02) {
      let abusers = userList.filter(u => u.spam)
      if (abusers.length <= 6) continue
      let votee = abusers[Math.floor(Math.random() * abusers.length)].id
      for (let j = 0; j < 5; j++) {
        let voter = userList.filter(u => u.spam)[Math.floor(Math.random() * userList.filter(u => u.spam).length)].id
        await vote(voter, votee, true)
      }
    }

    // 1 random normal user vote 1 random normal user: 50% chance
    if (Math.random() < 0.5) {
      let votee = userList.filter(u => !u.spam)[Math.floor(Math.random() * userList.filter(u => !u.spam).length)].id
      let voter = userList.filter(u => !u.spam)[Math.floor(Math.random() * userList.filter(u => !u.spam).length)].id
      await vote(voter, votee, true)
    }
  }

  // Print the result
  console.log(`Total users: ${userList.length}`)
  console.log(`Maxium trustRank: ${Math.max(...userList.map(u => u.trustRank))}`)
  console.log(`Minium trustRank: ${Math.min(...userList.map(u => u.trustRank))}`)
  console.log(`Average trustRank: ${userList.reduce((a, b) => a + b.trustRank, 0) / userList.length}`)
  console.log(`====`)
  let normalUsers = userList.filter(u => !u.spam)
  console.log(`Normal users: ${normalUsers.length}`)
  console.log(`Maxium TR of normal user: ${Math.max(...normalUsers.map(u => u.trustRank))}`)
  console.log(`Minium TR of normal user: ${Math.min(...normalUsers.map(u => u.trustRank))}`)
  console.log(`Average TR of normal user: ${normalUsers.reduce((a, b) => a + b.trustRank, 0) / normalUsers.length}`)
  console.log(`====`)
  let spamUsers = userList.filter(u => u.spam)
  console.log(`Abusers: ${spamUsers.length}`)
  console.log(`Maxium TR of abuser: ${Math.max(...spamUsers.map(u => u.trustRank))}`)
  console.log(`Minium TR of abuser: ${Math.min(...spamUsers.map(u => u.trustRank))}`)
  console.log(`Average TR of abuser: ${spamUsers.reduce((a, b) => a + b.trustRank, 0) / spamUsers.length}`)
  console.log(`Abusers have positive TR: ${spamUsers.filter(u => u.trustRank > 0).length}`)
}

main()

async function normalVoteSpams() {
  // List all normal users
  let normalUsers = userList.filter(u => !u.spam)
  // List all spam users
  let spamUsers = userList.filter(u => u.spam)
  if (spamUsers.length <= 0) return

  // Randomly select 5 normal users
  let voters = [] as number[]
  for (let i = 0; i < 5; i++) {
    voters.push(normalUsers[Math.floor(Math.random() * normalUsers.length)].id)
  }
  
  // Randomly select 1 spam user
  let votee = spamUsers[Math.floor(Math.random() * spamUsers.length)].id

  // Vote
  for (let i = 0; i < 5; i++) await vote(voters[i], votee, false)
}