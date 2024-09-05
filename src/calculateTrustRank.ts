function calculateTrustRank(voteList: { trust: boolean, trustRank: number; otherVotes: number }[]): number {
  let rawTrustScore = 0
  for (let i in voteList) {
    let vote = voteList[i]
    if (vote.trust)rawTrustScore += vote.trustRank / vote.otherVotes
    else rawTrustScore -= vote.trustRank / vote.otherVotes
  }
  // Sigmoid function to normalize the trust score
  if (rawTrustScore > 0) {
    return 1 / (1 + Math.exp(-rawTrustScore))
  } else {
    return -1 / (1 + Math.exp(rawTrustScore))
  }
}

export default calculateTrustRank