# TrustRank
This is a simple algorithem of TrustRank, an algorithem that used for evaluate someone’s reputation in a social network. The simulation implementation is also attached inside the repository.

## Algorithem
The TrustRank algorithem is inspired by [PageRank](https://en.wikipedia.org/wiki/PageRank), an algorithem to calculate the weights of webpages.

Firstly, we will calculate the “relay trust score” for the votee:

![LaTeX for the relay trust score](https://latex.codecogs.com/svg.image?\text{rawTrustScore}=\sum_{i=1}^{n}\left(\frac{TR(v_i)}{V(v_i)}\right)\cdot\text{sign}(v_i))

In this formula:

- Calculate the vote weight of each single voter.
- The voter may vote the votee as “trusted” or “untrusted”. The weight will multiply by -1 if voter votes untrust, and vice versa.
- Sum up the vote results voted by all voters.

Then, the algorighem will map the relayed score to the interval [-1, 1] with Sigmoid function, according to the mark of the relay result.

## Simulating
The `test` folder has some code to simulate the real world context, including:

- A normal register a new account (20% chance)
- An abuser register 5 spam accounts (2% chance)
- An abuser requests 5 trust votes from other spam accounts for single spam account (simulate purchase upvote from other spammers, 2% chance)
- 5 normal users give 5 untrust votes to a spam account (simulate spam account send spam to a group chat, 50% chance)
- A normal user trust another normal user (50% chance)

Other limitations applied in the simulation program:

- Accounts has negative TR will not be able to vote others
- One account can only trust vote others 5 times (simulate rate limit in a short period)

Program output:

```text
Total users: 3056
Maxium trustRank: 0.659045770113111
Minium trustRank: -0.6573961384063101
Average trustRank: 0.1740412817879677
====
Normal users: 2121
Maxium TR of normal user: 0.659045770113111
Minium TR of normal user: 0.1
Average TR of normal user: 0.47638180526734636
====
Abusers: 935
Maxium TR of abuser: 0.52497918747894
Minium TR of abuser: -0.6573961384063101
Average TR of abuser: -0.5118028361796922
Abusers have positive TR: 150
```

This output illustrate that although the most abusers have negative value, there are chances that abusers may got high positive TR. Especially for someone may intent to create some “high quality trust vote available” spam accounts.