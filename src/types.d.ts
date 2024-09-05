declare global {
  /*
  * Define the User
  */
  interface User {
    // The user's ID
    id: number,

    // The user's trustrank
    trustRank: number
  }

  /*
  * Define the Vote
  */
  interface Vote {
    // The user who votes
    voter: number,

    // The user who is being voted
    votee: number,

    // The vote value
    trust: boolean
  }
}

export {}