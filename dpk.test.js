const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");
const {TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH} = require('./constants');

describe("deterministicPartitionKey", () => {
  it("Returns the literal TRIVIAL_PARTITION_KEY when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe(TRIVIAL_PARTITION_KEY);
  });

  it("Returns partitionKey when input event has this property", () => {
    const event = {
      partitionKey: `asas`,
      detail: 'event test'
    }
    const candidate = event.partitionKey;
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(candidate);
  });

  it("Returns partitionKey converted in string when input event has this property in other type", () => {
    const event = {
      partitionKey: 100,
      detail: 'event test'
    }
    const candidate = JSON.stringify(event.partitionKey);
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(candidate);
  });

  it("Returns hash candidate when input event doesn't have property partitionKey", () => {
    const event = {
      detail: 'event test'
    }
    let candidate = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(candidate);
  });

  it("Returns hash candidate when input event has property partitionKey with lengh greater than MAX_PARTITION_KEY_LENGTH", () => {
    //creating a partitionKey greater than max partition key (1 additional char)
    let partitionKey = ''
    for (let i = 0; i<= MAX_PARTITION_KEY_LENGTH; i++) {
      partitionKey = partitionKey.concat('a')
    }
    const event = {
      partitionKey,
      detail: 'event test'
    }
    candidate = crypto.createHash("sha3-512").update(event.partitionKey).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(candidate);
  });
});
