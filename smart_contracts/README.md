



## Commands

Compile contracts:
```
forge build
```

Run tests:
```
forge test
```

Run file of tests:
```
forge test --match-path test/GhoFlow_tests.t.sol
```

Run single test:
```
forge t --match-test testMintGho
```


## Packages used:

GHO and AAVE:
```
forge install aave/aave-v3-core@a00f28e aave/gho-core@2abe8f7 OpenZeppelin/openzeppelin-contracts@d00acef aave/aave-v3-periphery@551c497
```

Superfluid (We overwrite the openzeppelin-contracts package version)
```
forge install superfluid-protocol-monorepo=https://github.com/superfluid-finance/protocol-monorepo@dev --no-commit

forge install https://github.com/OpenZeppelin/openzeppelin-contracts@v4.9.3 --no-commit
```
