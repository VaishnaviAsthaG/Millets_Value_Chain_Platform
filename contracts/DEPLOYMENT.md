# Smart Contract Deployment Guide

## Prerequisites

1. **Sepolia ETH**: You need Sepolia testnet ETH to deploy the contract. Get it from:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

2. **Environment Variables**: Create a `.env` file in the `contracts` directory:
   ```
   RPC_URL=https://eth-sepolia.g.alchemy.com/v2/WeoY0of6-2TsKu4Y_Pwc7
   PRIVATE_KEY=d57436693406454381666da41b7588f82610febb2bd72416a35d09a25143d82b
   ```

## Deployment Steps

1. **Install Dependencies**:
   ```bash
   cd contracts
   npm install
   ```

2. **Compile Contract**:
   ```bash
   npm run compile
   ```

3. **Deploy to Sepolia**:
   ```bash
   npm run deploy:sepolia
   ```

4. **After Deployment**:
   - The contract address will be saved in `deployment.json`
   - Update `backend/.env` with `CONTRACT_ADDRESS=<deployed_address>`
   - Restart the backend server

## Local Testing (Hardhat Network)

For local testing without Sepolia ETH:

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

## Contract Address

After successful deployment, the contract address will be:
- Saved in `contracts/deployment.json`
- Displayed in the console output
- Needs to be added to `backend/.env` as `CONTRACT_ADDRESS`

## Troubleshooting

- **Insufficient Funds**: Make sure your wallet has Sepolia ETH (at least 0.001 ETH recommended)
- **Network Issues**: Check your RPC URL is correct and accessible
- **Private Key**: Ensure your private key is correct and has funds


