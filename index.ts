import nodeFetch from 'node-fetch';
import { BaseProvider } from '@ethersproject/providers';
import { downloadContractsBlob, ContractsBlob } from '@generationsoftware/pt-v5-utils-js';
import {
  getProvider,
  loadPrizeClaimerEnvVars,
  instantiateRelayerAccount,
  runPrizeClaimer,
  PrizeClaimerEnvVars,
  PrizeClaimerConfig,
  RelayerAccount,
} from '@generationsoftware/pt-v5-autotasks-library';


/**
 * Asynchronously initializes and runs the prize claimer process.
 * This function sets up the environment, configures the prize claimer,
 * downloads necessary contract information, and executes the prize claiming process.
 * @returns {Promise<void>} A promise that resolves when the prize claimer process completes
 * @throws {Error} If there are issues with environment setup, configuration, or execution
 */
const main = async () =>{
  const envVars: PrizeClaimerEnvVars = loadPrizeClaimerEnvVars();
  const provider: BaseProvider = getProvider(envVars);

  const relayerAccount: RelayerAccount = await instantiateRelayerAccount(
    provider,
    envVars.CUSTOM_RELAYER_PRIVATE_KEY,
  );

  const config: PrizeClaimerConfig = {
    ...relayerAccount,
    provider,
    chainId: envVars.CHAIN_ID,
    rewardRecipient: envVars.REWARD_RECIPIENT,
    minProfitThresholdUsd: Number(envVars.MIN_PROFIT_THRESHOLD_USD),
    covalentApiKey: envVars.COVALENT_API_KEY,
    contractJsonUrl: envVars.CONTRACT_JSON_URL,
    subgraphUrl: envVars.SUBGRAPH_URL,
  };

  const contracts: ContractsBlob = await downloadContractsBlob(config.contractJsonUrl, nodeFetch);
  await runPrizeClaimer(contracts, config);
}

main() 
