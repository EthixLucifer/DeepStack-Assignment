// config.js

const CONTRACT_ADDRESSES = {
    NFT: '0x152616B7E738A0E671b9AFcC9c956b97d2b96Bf3',
    CandleAuction: '0xa9dc1e9c25949DEc687C93619d9a26BFB4702F32',
  };
  
  const API_KEYS = {
    chainlinkVRF: 'your_chainlink_vrf_api_key_here',
    // Add other API keys as needed
  };
  
  const PRIVATE_KEYS = {
    demoPrivateKey: 'your_demo_private_key_here',
    // Add other private keys as needed
  };
  
  const CHAINLINK_VRF_CONFIG = {
    vrfCoordinator: 'your_vrf_coordinator_here',
    keyHash: 'your_key_hash_here',
    subscriptionId: 'your_subscription_id_here',
    callbackGasLimit: 'your_callback_gas_limit_here',
    requestConfirmations: 'your_request_confirmations_here',
  };
  
  module.exports = {
    CONTRACT_ADDRESSES,
    API_KEYS,
    PRIVATE_KEYS,
    CHAINLINK_VRF_CONFIG,
  };
  