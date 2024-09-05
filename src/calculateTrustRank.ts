function calculateTrustRank(trustList: {
  trustRank: number;
  otherTrustee: number;
}[]): number {
  let rawTrustRank = 0
  for (let i in trustList) {
    let otherTrustee = trustList[i].otherTrustee
    if (otherTrustee === 0) otherTrustee = 1
    rawTrustRank += trustList[i].trustRank / otherTrustee
  }

  // Damping Factor
  const d = 0.85
  return 1 - d + d * rawTrustRank
}

export default calculateTrustRank