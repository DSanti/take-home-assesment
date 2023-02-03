const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("When given an event without partitionKey, the event is stringified, hashed and returned", () => {
    const event = { notPartitionKey: 'test partition key' };
    const result = deterministicPartitionKey(event);
    expect(result).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });
  it("When event.partitionKey is not of the string type, it's stringified, hashed if its length is above MAX_PARTITION_KEY_LENGTH", () => {
    let partitionKey = '';
    while (partitionKey.length<256) { partitionKey+=Math.random().toString()}
    const event = { partitionKey: {numbers: partitionKey}};
    const result = deterministicPartitionKey(event);
    expect(result).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event.partitionKey)).digest("hex"));
  });
  it("When event.partitionKey is not of the string type, it's stringified and returned if its length is below MAX_PARTITION_KEY_LENGTH", () => {
    const event = { partitionKey: { numbers: 12345 }};
    const result = deterministicPartitionKey(event);
    expect(result).toBe(JSON.stringify(event.partitionKey));
  });
  it("When event.partitionKey's lenght is above MAX_PARTITION_KEY_LENGTH, it is hashed before being returned", () => {
    let partitionKey = '';
    while (partitionKey.length<256) { partitionKey+=Math.random().toString()}
    const event = { partitionKey };
    const result = deterministicPartitionKey(event);
    expect(result).toBe(crypto.createHash("sha3-512").update(partitionKey).digest("hex"));
  });
  it("When event.partitionKey's lenght is below MAX_PARTITION_KEY_LENGTH, it is returned without further modification", () => {
    const event = { partitionKey: 'test partition key' };
    const result = deterministicPartitionKey(event);
    expect(result).toBe(event.partitionKey);
  });
});
