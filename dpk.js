const crypto = require("crypto");
const {TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH} = require('./constants');

exports.deterministicPartitionKey = (event) => {
  let candidate;
  //Not event parameter --> return TRIVIAL_PARTITION_KEY
  if(!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  //Checking parameter partitionKey to return it, 
  if (event.partitionKey) {
      candidate = typeof event.partitionKey !== 'string' ?
                  JSON.stringify(event.partitionKey):
                  event.partitionKey;
      //if length greater tahn MAX PART then hash partitionKey
      if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
      }
  } else {
      //returning hash of the event
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }

  return candidate;
};

