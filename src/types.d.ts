declare global {
  /*
  * Define the User
  */
  interface User {
    // The user's ID
    id: number,

    // The user's trustrank
    trustRank: number,

    // If the user is an ad
    isAbuse: boolean
  }

  /*
  * Define the Trust
  */
  interface Trust {
    // The user who trusts
    from: number,

    // The user who is trusted
    to: number
  }
}

export {}