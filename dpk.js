const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const hashPartitionKey = (partitionKey) => crypto.createHash("sha3-512").update(partitionKey).digest("hex");

exports.deterministicPartitionKey = (event) => {

  if (!event) return TRIVIAL_PARTITION_KEY;

  const partitionKeyToString = (partitionKey) => {
    if(typeof partitionKey !== "string") return JSON.stringify(partitionKey);
    return partitionKey;
  }

  const candidate = event.partitionKey ? partitionKeyToString(event.partitionKey) : hashPartitionKey(JSON.stringify(event));

  return candidate.length > MAX_PARTITION_KEY_LENGTH ? hashPartitionKey(candidate) : candidate;
};