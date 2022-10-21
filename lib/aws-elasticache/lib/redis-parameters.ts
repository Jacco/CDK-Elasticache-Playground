// memcached1.4 | memcached1.5 | memcached1.6
// redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x

import { Resource } from "aws-cdk-lib";
import { CfnParameterGroup } from "aws-cdk-lib/aws-elasticache";
import { Construct } from "constructs";

type ParameterGroupContents = { [id: string] : string; };

export enum ApppendFSync {
  /**
   *  The buffer is flushed once per second. This is the default.
   */
  EVERY_SECOND = "everysec",
  /**
   * The buffer is flushed to disk on an as-needed basis.
   */
  NO = "no",
  /**
   * The buffer is flushed every time that data in the cluster is modified.
   */
  ALWAYS = "always",
}

/**
 * The types of keyspace events that Redis can notify clients of. Each event type is represented by a single letter
 */
export enum NotifyKeySpaceEvents {
    NONE = 0,
    /**
     * K — Keyspace events, published with a prefix of __keyspace@<db>__
     */
    KEYSPACE = 1,      // K
    /**
     * E — Key-event events, published with a prefix of __keyevent@<db>__
     */
    KEY_EVENT = 2,     // E 
    /**
     * g — Generic, non-specific commands such as DEL, EXPIRE, RENAME, etc.
     */
    GENERIC = 4,       // g
    /**
     * $ — String commands
     */
    STRING = 8,        // $
    /**
     * l — List commands
     */
    LIST = 16,          // l
    /**
     * s — Set commands
     */
    SET = 32,           // s
    /**
     * h — Hash commands
     */
    HASH = 64,          // h
    /**
     * z — Sorted set commands
     */
    SORTED = 128,        // z
    /**
     * x — Expired events (events generated every time a key expires)
     */
    EXPIRED = 256,       // x
    /**
     * e — Evicted events (events generated when a key is evicted for maxmemory)
     */
    EVICTED = 512,       // e
    /**
     * A — An alias for g$lshzxe
     */
    ALL_COMMANDS = 1024, // A
}

function notifyKeySpaceEventsToString(value: NotifyKeySpaceEvents): string {
  const chars = 'KEg$lshzxeA';
  let result = '';
  let p = 1;
  for(let c of chars) {
    if (value & p) {
      result += c
    }
    p <<= 1;
  }
  return result;
}

export enum MaxMemoryPolicy {
  /**
   * Keeps most recently used keys; removes least recently used (LRU) keys
   */
  ALLKEYS_LRU = "allkeys-lru",
  /**
   * Removes least recently used keys with the expire field set to true.
   */
  VOLATILE_LRU = "volatile-lru", 
  /**
   * Keeps frequently used keys; removes least frequently used (LFU) keys
   */
  ALLKEYS_LFU = "allkeys-lfu", // from version 4.0.10
  /**
   * Removes least frequently used keys with the expire field set to true.
   */
  VOLATILE_LFU = "volatile-lfu", // from version 4.0.10
  /**
   * Randomly removes keys to make space for the new data added.
   */
  ALLKEYS_RANDOM = "allkeys-random", 
  /**
   * Randomly removes keys with expire field set to true.
   */
  VOLATILE_RANDOM = "volatile-random", 
  /**
   * Removes keys with expire field set to true and the shortest remaining time-to-live (TTL) value.
   */
  VOLATILE_TTL = "volatile-ttl", 
  /**
   * New values aren’t saved when memory limit is reached. When a database uses replication, 
   * this applies to the primary database
   */
  NOEVICTION = "noeviction"
}


export enum PubSubACL {
  ALLCHANNELS = "allchannels",
  RESETCHANNELS = "resetchannels"
}


const renamableCommands = [
  "append",
  "auth",
  "bitcount",
  "bitfield",
  "bitop",
  "bitpos",
  "blpop",
  "brpop",
  "brpoplpush",
  "bzpopmin",
  "bzpopmax",
  "client",
  "cluster",
  "command",
  "dbsize",
  "decr",
  "decrby",
  "del",
  "discard",
  "dump",
  "echo",
  "eval",
  "evalsha",
  "exec",
  "exists",
  "expire",
  "expireat",
  "flushall",
  "flushdb",
  "geoadd",
  "geohash",
  "geopos",
  "geodist",
  "georadius",
  "georadiusbymember",
  "get",
  "getbit",
  "getrange",
  "getset",
  "hdel",
  "hexists",
  "hget",
  "hgetall",
  "hincrby",
  "hincrbyfloat",
  "hkeys",
  "hlen",
  "hmget",
  "hmset",
  "hset",
  "hsetnx",
  "hstrlen",
  "hvals",
  "incr",
  "incrby",
  "incrbyfloat",
  "info",
  "keys",
  "lastsave",
  "lindex",
  "linsert",
  "llen",
  "lpop",
  "lpush",
  "lpushx",
  "lrange",
  "lrem",
  "lset",
  "ltrim",
  "memory",
  "mget",
  "monitor",
  "move",
  "mset",
  "msetnx",
  "multi",
  "object",
  "persist",
  "pexpire",
  "pexpireat",
  "pfadd",
  "pfcount",
  "pfmerge",
  "ping",
  "psetex",
  "psubscribe",
  "pubsub",
  "pttl",
  "publish",
  "punsubscribe",
  "randomkey",
  "readonly",
  "readwrite",
  "rename",
  "renamenx",
  "restore",
  "role",
  "rpop",
  "rpoplpush",
  "rpush",
  "rpushx",
  "sadd",
  "scard",
  "script",
  "sdiff",
  "sdiffstore",
  "select",
  "set",
  "setbit",
  "setex",
  "setnx",
  "setrange",
  "sinter",
  "sinterstore",
  "sismember",
  "slowlog",
  "smembers",
  "smove",
  "sort",
  "spop",
  "srandmember",
  "srem",
  "strlen",
  "subscribe",
  "sunion",
  "sunionstore",
  "swapdb",
  "time",
  "touch",
  "ttl",
  "type",
  "unsubscribe",
  "unlink",
  "unwatch",
  "wait",
  "watch",
  "zadd",
  "zcard",
  "zcount",
  "zincrby",
  "zinterstore",
  "zlexcount",
  "zpopmax",
  "zpopmin",
  "zrange",
  "zrangebylex",
  "zrevrangebylex",
  "zrangebyscore",
  "zrank",
  "zrem",
  "zremrangebylex",
  "zremrangebyrank",
  "zremrangebyscore",
  "zrevrange",
  "zrevrangebyscore",
  "zrevrank",
  "zscore",
  "zunionstore",
  "scan",
  "sscan",
  "hscan",
  "zscan",
  "xinfo",
  "xadd",
  "xtrim",
  "xdel",
  "xrange",
  "xrevrange",
  "xlen",
  "xread",
  "xgroup",
  "xreadgroup",
  "xack",
  "xclaim",
  "xpending",
  "georadius_ro",
  "georadiusbymember_ro",
  "lolwut",
  "xsetid",
  "substr"
]

/**
 * Base class
 */
const propertyLists: { [key: string]: string[] } = {}
const deprecationList: { [key: string]: string[] } = {}
const nonModifiableLists: { [key: string]: string[] } = {}

 export class RedisParameterPropsBase {
  public static get parameterKeys(): string[] {
    let obj: any = this;
    let name = obj.name;
    const result = [];
    const deprecated = [];
    while (name !== 'RedisParameterPropsBase') {
      if (propertyLists[name]) {
        result.push(...propertyLists[name]);
      }
      if (deprecationList[name]) {
        deprecated.push(...deprecationList[name]);
      }
      obj = Object.getPrototypeOf(obj.prototype).constructor;
      name = obj.name;
    }
    const dep_set = new Set(deprecated);
    return [... new Set(result.filter(x => !dep_set.has(x)))];
  }

  public static get nonModifiableKeys(): string[] {
    let obj: any = this;
    let name = obj.name;
    const result = [];
    while (name !== 'RedisParameterPropsBase') {
      if (nonModifiableLists[name]) {
        result.push(...nonModifiableLists[name]);
      }
      obj = Object.getPrototypeOf(obj.prototype).constructor;
      name = obj.name;
    }
    return result;
  }
}


const metadata = (target: any, key: string) => {
  const name = (target.constructor as typeof RedisParameterPropsBase).name;
  if (propertyLists[name]) {
    propertyLists[name].push(key)
  } else {
    propertyLists[name] = [key]
  }
}

const deprecate_metadata = (target: any, key: string) => {
  const name = (target.constructor as typeof RedisParameterPropsBase).name;
  if (deprecationList[name]) {
    deprecationList[name].push(key)
  } else {
    deprecationList[name] = [key]
  }
}

const nonmodifiable_metadata = (target: any, key: string) => {
  const name = (target.constructor as typeof RedisParameterPropsBase).name;
  if (nonModifiableLists[name]) {
    nonModifiableLists[name].push(key)
  } else {
    nonModifiableLists[name] = [key]
  }
  metadata(target, key);
}

export class RedisParameterProps26 extends RedisParameterPropsBase {
  /**
   * Determines whether to enable Redis' active rehashing feature. The main hash table is rehashed ten
   * times per second; each rehash operation consumes 1 millisecond of CPU time.
   * 
   * This value is set when you create the parameter group. When assigning a new parameter group to a cluster, 
   * this value must be the same in both the old and new parameter groups.
   * 
   * Modifiable: Yes, changes take place at Creation
   * 
   * @default true
   */
  @metadata
  readonly activerehashing?: boolean;

  /**
   * Enables or disables Redis' append only file feature (AOF). AOF captures any Redis commands that change
   * data in the cache, and is used to recover from certain node failures.
   * 
   * For more information, see https://docs.aws.amazon.com/AmazonElastiCache/latest/red_ug/FaultTolerance.html.
   * 
   * Append Only Files (AOF) is not supported for cache.t1.micro and cache.t2.* nodes. For nodes of this type, 
   * the appendonly parameter value is ignored.
   * 
   * For Multi_AZ replication groups, AOF is not allowed.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * @default false meaning AOF is turned off
   */
  @metadata
  readonly appendonly?: boolean;

  /**
   * When appendonly is set to yes, controls how often the AOF output buffer is written to disk.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * >= 2.8.22 unsupported
   */
  @metadata
  readonly appendfsync?: ApppendFSync;

  /**
   * If a client's output buffer reaches the specified number of bytes, the client will be 
   * disconnected.
   * 
   * Modifiable: Yes changes take effect immediately
   * 
   * @default 0 No hard limit
   */
  @metadata
  readonly clientOutputBufferLimitNormalHardLimit?: number;

  /**
   * If a client's output buffer reaches the specified number of bytes, the client will be 
   * disconnected, but only if this condition persists for client-output-buffer-limit-normal-soft-seconds. 
   * 
   * Modifiable: Yes changes take effect immediately
   * 
   * @default 0 No soft limit
   */
  @metadata
  readonly clientOutputBufferLimitNormalSoftLimit?: number;

  /**
   * If a client's output buffer remains at client-output-buffer-limit-normal-soft-limit bytes for longer
   * than this number of seconds, the client will be disconnected.
   * 
   * Modifiable: Yes changes take effect immediately
   * 
   * @default 0 No time limit
   */
  @metadata
  readonly clientOutputBufferLimitNormalSoftSeconds?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer reaches the specified number of bytes, 
   * the client will be disconnected.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 33554432
   */
  @metadata
  readonly clientOutputBufferLimitPubsubHardLimit?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer reaches the specified number of bytes, 
   * the client will be disconnected, but only if this condition persists for 
   * client-output-buffer-limit-pubsub-soft-seconds.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 8388608
   */
  @metadata
  readonly clientOutputBufferLimitPubsubSoftLimit?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer remains at 
   * client-output-buffer-limit-pubsub-soft-limit bytes for longer than this number of seconds, the client
   * will be disconnected.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 60
   */
  @metadata
  readonly clientOutputBufferLimitPubsubSoftSeconds?: number;

  /**
   * NOT MODIFIABLE DO NOT SPECIFY
   * 
   * For Redis read replicas: If a client's output buffer reaches the specified 
   * number of bytes, the client will be disconnected, but only if this condition 
   * persists for client-output-buffer-limit-slave-soft-seconds.
   * 
   * @default - For values see Redis node-type specific parameters (10% of maxmemory)
   */
  @nonmodifiable_metadata
  readonly clientOutputBufferLimitSlaveSoftLimit?: number;

  /**
   * NOT MODIFIABLE DO NOT SPECIFY
   * 
   * For Redis read replicas: If a client's output buffer remains at 
   * client-output-buffer-limit-slave-soft-limit bytes for longer than this 
   * number of seconds, the client will be disconnected.
   * 
   * @default 60
   */
  @nonmodifiable_metadata
  readonly clientOutputBufferLimitSlaveSoftSeconds?: number;

  /**
   * NOT MODIFIABLE DO NOT SPECIFY
   * 
   * The number of logical partitions the databases is split into. We recommend keeping this value low.
   * This value is set when you create the parameter group. When assigning a new parameter group to a cluster, 
   * this value must be the same in both the old and new parameter groups.
   * 
   * @default 16
   */
  @nonmodifiable_metadata
  readonly databases?: number;

  /**
   * Determines the amount of memory used for hashes. Hashes with fewer than the specified number of entries 
   * are stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 512
   */
  @metadata
  readonly hashMaxZiplistEntries?: number;

  /**
   * Determines the amount of memory used for hashes. Hashes with entries that are smaller than the specified 
   * number of bytes are stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 64
   */
  @metadata
  readonly hashMaxZiplistValue?: number;

  /** 
   * Determines the amount of memory used for lists. Lists with fewer than the specified number of entries are 
   * stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 512
   */
  @metadata
  readonly listMaxZiplistEntries?: number; //(>= 3.2.4 unsupported)

  /**
   * Determines the amount of memory used for lists. Lists with entries that are smaller than the specified 
   * number of bytes are stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 64
   */
  @metadata
  readonly listMaxZiplistValue?: number; //(>= 3.2.4 unsupported)

  /**
   * NOT MODIFIABLE DO NOT SPECIFY
   * 
   * The maximum execution time for a Lua script, in milliseconds, before ElastiCache takes 
   * action to stop the script. If lua-time-limit is exceeded, all Redis commands will return 
   * an error of the form ____-BUSY. Since this state can cause interference with many essential 
   * Redis operations, ElastiCache will first issue a SCRIPT KILL command. If this is unsuccessful, 
   * ElastiCache will forcibly restart Redis.
   * 
   * @default 5000
   */
  @nonmodifiable_metadata
  readonly luaTimeLimit?: number;

  /**
   * NOT MODIFIABLE DO NOT SPECIFY
   * 
   * The maximum number of clients that can be connected at one time.
   * 
   * The default depends on the chosen NodeType
   * t2.medium Default: 20000
   * t2.small Default : 20000
   * t2.micro Default : 20000
   * t4g.micro Default: 20000
   * t3.medium Default: 65000
   * t3.small Default : 65000
   * t3.micro Default : 20000
   * 
   * @default 65000
   */
  @nonmodifiable_metadata
  readonly maxclients?: number;

  /**
   * The eviction policy for keys when maximum memory usage is reached.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default VOLATILE_LRU
   */
  @metadata
  readonly maxmemoryPolicy?: MaxMemoryPolicy; // 4.0.10 values changed

  /**
   * For least-recently-used (LRU) and time-to-live (TTL) calculations, this parameter 
   * represents the sample size of keys to check. By default, Redis chooses 3 keys and 
   * uses the one that was used least recently.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 3
   */
  @metadata
  readonly maxmemorySamples?: number;

  /**
   * The total memory, in bytes, reserved for non-data usage. By default, 
   * the Redis node will grow until it consumes the node's maxmemory (see 
   * Redis node-type specific parameters). If this occurs, then node performance 
   * will likely suffer due to excessive memory paging. By reserving memory you 
   * can set aside some of the available memory for non-Redis purposes to help 
   * reduce the amount of paging.
   * 
   * This parameter is specific to ElastiCache, and is not part of the standard Redis distribution.
   * 
   * For more information, see reserved-memory-percent and Managing Reserved Memory.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 0
   */
  @metadata
  readonly reservedMemory?: number;

  /**
   * Determines the amount of memory used for certain kinds of sets (strings that are 
   * integers in radix 10 in the range of 64 bit signed integers). Such sets with fewer than 
   * the specified number of entries are stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 512
   */
  @metadata
  readonly setMaxIntsetEntries?: number;

  /**
   * NOT MODIFIABLE DO NOT SPECIFY
   * 
   * Determines whether a read replica in Redis can have read replicas of its own.
   * 
   * @default false
   */
  @nonmodifiable_metadata
  readonly slaveAllowChaining?: boolean;

  /**
   * The maximum execution time, in microseconds, for commands to be logged by the Redis 
   * Slow Log feature.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 10000
   */
  @metadata
  readonly slowlogLogSlowerThan?: number;

  /**
   * The maximum length of the Redis Slow Log.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 128
   */
  @metadata
  readonly slowlogMaxLen?: number;

  /**
   * If this is set to a nonzero value (N), node clients are polled every N seconds
   * to ensure that they are still connected. With the default setting of 0, no such
   * polling occurs.
   * 
   * Important: Some aspects of this parameter changed in Redis version 3.2.4. See 
   * Parameters changed in Redis 3.2.4 (enhanced).
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 0
   */
  @metadata
  readonly tcpKeepalive?: number; // (>= 3.2.4 default from 0 -> 300)

  /**
   * The number of seconds a node waits before timing out. 
   * 
   * Values are: 
   * 
   * 0      – never disconnect an idle client.
   * 
   * 1-19   – invalid values.
   * 
   * 20-... – the number of seconds a node waits before disconnecting an idle client.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 0 Never disconnect
   */
  @metadata
  readonly timeout?: number;
  
  /**
   * Determines the amount of memory used for sorted sets. Sorted sets with fewer than
   * the specified number of elements are stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 128
   */
  @metadata
  readonly zsetMaxZiplistEntries?: number;

  /**
   * Determines the amount of memory used for sorted sets. Sorted sets with entries that are smaller than the specified number of bytes are stored using a special encoding that saves space.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 64
   */
  @metadata
  readonly zsetMaxZiplistValue?: number;
}

export class RedisParameterProps28 extends RedisParameterProps26 {
  /**
   * The number of seconds within which the primary node must receive a ping request from a 
   * read replica. If this amount of time passes and the primary does not receive a ping, 
   * then the replica is no longer considered available. If the number of available replicas 
   * drops below min-slaves-to-write, then the primary will stop accepting writes at that point.
   * 
   * If either this parameter or min-slaves-to-write is 0, then the primary node will always 
   * accept writes requests, even if no replicas are available.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 10
   */
  @metadata
  readonly minSlavesMaxLag?: number;      // later renamed

  /**
   * The minimum number of read replicas which must be available in order for the primary node 
   * to accept writes from clients. If the number of available replicas falls below this number, 
   * then the primary node will no longer accept write requests. If either this parameter or 
   * min-slaves-max-lag is 0, then the primary node will always accept writes requests, even if 
   * no replicas are available.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 0
   */
  @metadata
  readonly minSlavesToWrite?: number;     // later renamed

  /**
   * The types of keyspace events that Redis can notify clients of. Each event type is 
   * represented by an enum value:
   *
   * - NotifyKeySpaceEvents.NONE         - no events
   * - NotifyKeySpaceEvents.KEYSPACE     - Keyspace events, published with a prefix of __keyspace@<db>__
   * - NotifyKeySpaceEvents.KEY_EVENT    — Key-event events, published with a prefix of __keyevent@<db>__
   * - NotifyKeySpaceEvents.GENERIC      — Generic, non-specific commands such as DEL, EXPIRE, RENAME, etc.
   * - NotifyKeySpaceEvents.STRING       — String commands
   * - NotifyKeySpaceEvents.LIST         — List commands
   * - NotifyKeySpaceEvents.SET          — Set commands
   * - NotifyKeySpaceEvents.HASH         — Hash commands
   * - NotifyKeySpaceEvents.SORTED       — Sorted set commands
   * - NotifyKeySpaceEvents.EXPIRED      — Expired events (events generated every time a key expires)
   * - NotifyKeySpaceEvents.EVICTED      — Evicted events (events generated when a key is evicted for maxmemory)
   * - NotifyKeySpaceEvents.ALL_COMMANDS - An alias for g$lshzxe
   * 
   * You can have any combination of these event values using or (|). For example:
   * 
   * `NotifyKeySpaceEvents.KEYSPACE | NotifyKeySpaceEvents.KEY_EVENT  | NotifyKeySpaceEvents.ALL_COMMANDS`
   * 
   * means that Redis can publish notifications of all event types.
   * 
   * Do not use any characters other than those listed above; attempts to do so will result in
   * error messages.
   * 
   * @default NotifyKeySpaceEvents.NONE meaning that keyspace event notification is disabled.
   */
  @metadata
  readonly notifyKeyspaceEvents?: NotifyKeySpaceEvents;

  /**
   * The size, in bytes, of the primary node backlog buffer. The backlog is used for 
   * recording updates to data at the primary node. When a read replica connects to the 
   * primary, it attempts to perform a partial sync (psync), where it applies data from the 
   * backlog to catch up with the primary node. If the psync fails, then a full sync is 
   * required.
   * 
   * The minimum value for this parameter is 16384.
   * 
   * Note: Beginning with Redis 2.8.22, this parameter applies to the primary cluster as well as 
   * the read replicas.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 1048576
   */
  @metadata
  readonly replBacklogSize?: number;

  /**
   * The number of seconds that the primary node will retain the backlog buffer. Starting from the
   * time the last replica node disconnected, the data in the backlog will remain intact until 
   * repl-backlog-ttl expires. If the replica has not connected to the primary within this time, 
   * then the primary will release the backlog buffer. When the replica eventually reconnects, it 
   * will have to perform a full sync with the primary.
   * 
   * If this parameter is set to 0, then the backlog buffer will never be released.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 3600
   */
  @metadata
  readonly replBacklogTtl?: number;

  // >= 2.8.22, the repl-timeout unsupported (default is used), 6.0 unsupprted
  /**
   * Represents the timeout period, in seconds, for:
   * - Bulk data transfer during synchronization, from the read replica's perspective
   * - Primary node timeout from the replica's perspective
   * - Replica timeout from the primary node's perspective
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 60
   */
  @metadata
  readonly replTimeout?: number;

  // from 2.8.23
  /**
   * If enabled, clients who attempt to write to a read-only replica will be disconnected.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default true
   */
  @metadata
  readonly closeOnSlaveWrite?: boolean;
}

export class RedisParameterProps32 extends RedisParameterProps28 {
  /** 
   * DEPRECATED
   * 
   * @deprecated removed in 3.2 
   * */
  @deprecate_metadata
  readonly appendonly?: boolean;

  @nonmodifiable_metadata
  readonly activerehashing?: boolean;
  /**
   * 
   * Lists are encoded in a special way to save space. The number of entries allowed per internal list node can be specified as a fixed maximum size or a maximum number of elements. For a fixed maximum size, use -5 through -1, meaning:
   * 
   * - -5: max size: 64 Kb - not recommended for normal workloads
   * - -4: max size: 32 Kb - not recommended
   * - -3: max size: 16 Kb - not recommended
   * - -2: max size: 8 Kb - recommended
   * - -1: max size: 4 Kb - recommended
   * 
   * Positive numbers mean store up to exactly that number of elements per list node.
   * 
   * Modifiable: No
   * 
   * @default -2
   */
  @metadata
  readonly listMaxZiplistSize?: number;

  /**
   * Lists may also be compressed. Compress depth is the number of quicklist ziplist nodes 
   * from each side of the list to exclude from compression. The head and tail of the list 
   * are always uncompressed for fast push and pop operations. Settings are:
   * 
   * - 0: Disable all compression.
   * - 1: Start compressing with the 1st node in from the head and tail.
   *      [head]->node->node->...->node->[tail]
   *      All nodes except [head] and [tail] compress.
   * - 2: Start compressing with the 2nd node in from the head and tail.
   *      [head]->[next]->node->node->...->node->[prev]->[tail]
   *      [head], [next], [prev], [tail] do not compress. All other nodes compress.
   * - Etc.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 0
   */
  @metadata
  readonly listCompressDepth?: number;

  /**
   * Indicates whether this is a Redis (cluster mode enabled) replication group 
   * in cluster mode (yes) or a Redis (cluster mode enabled) replication group in 
   * non-cluster mode (no). Redis (cluster mode enabled) replication groups in cluster
   * mode can partition their data across up to 500 node groups.
   * 
   * Redis 3.2.x has two default parameter groups.
   * - default.redis3.2 – default value false.
   * - default.redis3.2.cluster.on – default value true.
   * 
   * Modifiable: No
   * 
   * @default ? depends
   */
  @metadata
  readonly clusterEnabled?: boolean;

  /**
   * When set to yes, Redis (cluster mode enabled) nodes in cluster mode stop accepting 
   * queries if they detect there is at least one hash slot uncovered (no available node 
   * is serving it). This way if the cluster is partially down, the cluster becomes unavailable. 
   * It automatically becomes available again as soon as all the slots are covered again.
   * 
   * However, sometimes you want the subset of the cluster which is working to continue to 
   * accept queries for the part of the key space that is still covered. To do so, just set 
   * the cluster-require-full-coverage option to false.
   * 
   * Modifiable: yes, changes take effect immediately
   * 
   * @default false
   */
  @metadata
  readonly clusterRequireFullCoverage?: boolean;

  /**
   * HyperLogLog sparse representation bytes limit. The limit includes the 16 byte header. 
   * When a HyperLogLog using the sparse representation crosses this limit, it is converted 
   * into the dense representation.
   * 
   * A value greater than 16000 is not recommended, because at that point the dense representation
   * is more memory efficient.
   * 
   * We recommend a value of about 3000 to have the benefits of the space-efficient encoding 
   * without slowing down PFADD too much, which is O(N) with the sparse encoding. The value 
   * can be raised to ~10000 when CPU is not a concern, but space is, and the data set is composed
   * of many HyperLogLogs with cardinality in the 0 - 15000 range.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 3000
   */
  @metadata
  readonly hllSparseMaxBytes?: number;

  /** 
   * The percent of a node's memory reserved for nondata use. By default, the Redis data 
   * footprint grows until it consumes all of the node's memory. If this occurs, then node 
   * performance will likely suffer due to excessive memory paging. By reserving memory, you can 
   * set aside some of the available memory for non-Redis purposes to help reduce the amount 
   * of paging.
   * 
   * This parameter is specific to ElastiCache, and is not part of the standard Redis distribution.
   * 
   * For more information, see reserved-memory and Managing Reserved Memory.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 25
   */ 
  @metadata
  readonly reservedMemoryPercent?: number;
}

export class RedisParameterProps40 extends RedisParameterProps32 {
  /**
   * Performs an asynchronous delete on evictions.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  @metadata
  readonly lazyfreeLazyEviction?: boolean;

  /**
   * Performs an asynchronous delete on expired keys.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  @metadata
  readonly lazyfreeLazyExpire?: boolean;

  /**
   * Performs an asynchronous delete for commands which update values.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  @metadata
  readonly lazyfreeLazyServerDel?: boolean;

  /* TODO should we have modifiable No params here? */
  /**
   * Changes take place: N/A	Performs an asynchronous flushDB during slave sync.
   * 
   * Modifiable: No
   * 
   * @default false
   */
  @metadata
  readonly slaveLazyFlush?: boolean;

  /**
   * Set the log factor, which determines the number of key hits to saturate the key counter.
   * 
   * Permitted values: any integer > 0
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 10
   */
  @metadata
  readonly lfuLogFactor?: number;

  /**
   * The amount of time in minutes to decrement the key counter.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 1
   */
  @metadata
  readonly lfuDecayTime?: number;

  /**
   * Enabled active defragmentation.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  @metadata
  readonly activedefrag?: boolean;

  /**
   * Minimum amount of fragmentation waste to start active defrag.
   * 
   * Permitted values: 10485760-104857600
   * 
   * Modifiable: Yes, changes take place: immediately
   *
   * @default 104857600 
   */
  @metadata
  readonly activeDefragIgnoreBytes?: number;

  /**
   * Minimum percentage of fragmentation to start active defrag.
   * 
   * Permitted values: 1-100
   * 
   * Modifiable: Yes, changes take place: immediately
   *
   * @default 10 
   */
  @metadata
  readonly activeDefragThresholdLower?: number;

  /**
   * Maximum percentage of fragmentation at which we use maximum effort.
   * 
   * Permitted values: 1-100
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 100
   */
  @metadata
  readonly activeDefragThresholdUpper?: number;

  /**
   * Minimal effort for defrag in CPU percentage.
   * 
   * Permitted values: 1-75
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 25
   */
  @metadata
  readonly activeDefragCycleMin?: number;

  /** 
   * Maximal effort for defrag in CPU percentage.
   * 
   * Permitted values: 1-75
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 75
   */
  @metadata
  readonly activeDefragCycleMax?: number;

  /**
   * Max size of a single client query buffer.
   * 
   * Permitted values: 1048576-1073741824
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 1073741824
   */
  @metadata
  readonly clientQueryBufferLimit?: number;

  /**
   * Max size of a single element request.
   * 
   * Permitted values: 1048576-536870912
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 536870912
   */
  @metadata
  readonly protoMaxBulkLen?: number;
}

export class RedisParameterProps50 extends RedisParameterProps40 {
  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to replica_lazy_flush 
   */
  @deprecate_metadata
  readonly slaveLazyFlush?: boolean;
  /**
   * Performs an asynchronous flushDB during replica sync. (renamed from: slave-lazy-flush)
   * 
   * Modifiable: No
   * 
   * @default true
   */
  @metadata
  readonly replicaLazyFlush?: boolean;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to clientOutputBufferLimitReplicaHardLimit 
   */
  @deprecate_metadata
  readonly clientOutputBufferLimitSlaveHardLimit?: number;
  /**
   * For Redis read replicas: If a client's output buffer reaches the specified number 
   * of bytes, the client will be disconnected. (renamed from: client-output-buffer-limit-slave-hard-limit)
   * 
   * Modifiable: No
   * 
   * @efault For values see Redis node-type specific parameters
   */
  @metadata
  readonly clientOutputBufferLimitReplicaHardLimit?: number;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to clientOutputBufferLimitReplicaSoftLimit 
   */
  @deprecate_metadata
  readonly clientOutputBufferLimitSlaveSoftLimit?: number;
   /**
   * For Redis read replicas: If a client's output buffer reaches the specified number 
   * of bytes, the client will be disconnected, but only if this condition persists 
   * for client-output-buffer-limit-replica-soft-seconds.
   * 
   * Modifiable: No
   * 
   * Former name: clientOutputBufferLimitSlaveSoftLimit
   * 
   * @default depends For values see Redis node-type specific parameters
   */
  @metadata
  readonly clientOutputBufferLimitReplicaSoftLimit?: number;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to clientOutputBufferLimitReplicaSoftLimit 
   */
  @deprecate_metadata
  readonly clientOutputBufferLimitSlaveSoftSeconds?: number;
  /**
   * For Redis read replicas: If a client's output buffer remains at 
   * client-output-buffer-limit-replica-soft-limit bytes for longer than this number 
   * of seconds, the client will be disconnected.
   * 
   * Modifiable: No
   * 
   * Former name: client-output-buffer-limit-slave-soft-seconds
   * 
   * @default 60
   */
  @metadata
  readonly clientOutputBufferLimitReplicaSoftSeconds?: number;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to replicaAllowChaining 
   */
  @deprecate_metadata
  readonly slaveAllowChaining?: boolean;
  /**
   * Determines whether a read replica in Redis can have read replicas of its own.
   * 
   * Modifiable: No
   * 
   * Former name: slaveAllowChaining
   * 
   * @default false
   */
  @metadata
  readonly replicaAllowChaining?: boolean;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to minReplicasToWrite 
   */
  @deprecate_metadata
  readonly minSlavesToWrite?: number;
  /**
   * The minimum number of read replicas which must be available in order for the primary node to 
   * accept writes from clients. If the number of available replicas falls below this number, then 
   * the primary node will no longer accept write requests.
   * 
   * If either this parameter or min-replicas-max-lag is 0, then the primary node will always accept 
   * writes requests, even if no replicas are available.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * Former name: minSlavesToWrite
   * 
   * @default 0
   */
  @metadata
  readonly minReplicasToWrite?: number;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to minReplicasMaxLag 
   */
  @deprecate_metadata
  readonly minSlavesMaxLag?: number;
  /**
   * The number of seconds within which the primary node must receive a ping request 
   * from a read replica. If this amount of time passes and the primary does not receive 
   * a ping, then the replica is no longer considered available. If the number of available 
   * replicas drops below min-replicas-to-write, then the primary will stop accepting writes 
   * at that point.
   * 
   * If either this parameter or min-replicas-to-write is 0, then the primary node will always 
   * accept write requests, even if no replicas are available.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * Former name: minSlavesMaxLag
   * 
   * @default 10
   */
  @metadata
  readonly minReplicasMaxLag?: number;

  /** 
   * DEPRECATED
   * 
   * @deprecated renamed to closeOnReplicaWrite 
   */
  @deprecate_metadata
  readonly closeOnSlaveWrite?: boolean;
  /**
   * If enabled, clients who attempt to write to a read-only replica will be disconnected.
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * Former name: closeOnSlaveWrite
   * 
   * @default true
   */
  @metadata
  readonly closeOnReplicaWrite?: boolean;

  // 5.0
  /**
   * The stream data structure is a radix tree of nodes that encode multiple items inside. 
   * Use this configuration to specify the maximum size of a single node in radix tree in Bytes. 
   * If set to 0, the size of the tree node is unlimited.
   * 
   * Permitted values: 0+ TODO
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 4096
   */
  @metadata
  readonly streamNodeMaxBytes?: number;

  /**
   * The stream data structure is a radix tree of nodes that encode multiple items inside. 
   * Use this configuration to specify the maximum number of items a single node can contain 
   * before switching to a new node when appending new stream entries. If set to 0, the number 
   * of items in the tree node is unlimited
   * 
   * Permitted values: 0+
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 100
   */
  @metadata
  readonly streamNodeMaxEntries?: number;

  /**
   * Maximum number of set/hash/zset/list fields that will be processed from the main dictionary scan
   * 
   * Permitted values: 1 to 1000000 TODO
   * 
   * Modifiable: Yes, changes take effect immediately
   * 
   * @default 1000
   */
  @metadata
  readonly activeDefragMaxScanFields?: number;

  /**
   * Always enable Lua effect replication or not in Lua scripts
   * 
   * Modifiable: Yes, changes take effect: Immediately
   * 
   * @default true
   */
  @metadata
  readonly luaReplicateCommands?: boolean;

  /**
   * Determines if replica ignores maxmemory setting by not evicting items independent from the primary
   * 
   * Modifiable: No
   * 
   * @default true
   */
  @metadata
  readonly replicaIgnoreMaxmemory?: boolean;

  /**
   * Allows you to rename potentially dangerous or expensive Redis commands that might cause 
   * accidental data loss, such as FLUSHALL or FLUSHDB. This is similar to the rename-command
   * configuration in open source Redis. However, ElastiCache has improved the experience by 
   * providing a fully managed workflow. The command name changes are applied immediately, and 
   * automatically propagated across all nodes in the cluster that contain the command list. 
   * There is no intervention required on your part, such as rebooting nodes.
   * 
   * All renamed commands should be alphanumeric.
   * The maximum length of new command names is 20 alphanumeric characters.
   * When renaming commands, ensure that you update the parameter group associated with your cluster.
   * To prevent a command's use entirely, use the keyword blocked
   */
  @metadata
  readonly renameCommands?: { [key: string]: string };
}

export class RedisParameterProps6X extends RedisParameterProps50 {
  /**
   * When set to true, a Redis (cluster mode enabled) replication group continues to
   * process read commands even when a node is not able to reach a quorum of primaries.
   * 
   * When set to the default of false, the replication group rejects all commands. We recommend 
   * setting this value to yes if you are using a cluster with fewer than three node groups 
   * or your application can safely handle stale reads.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default false
   */
  @metadata
  readonly clusterAllowReadsWhenDown?: boolean;

  /**
   * To assist client-side caching, Redis supports tracking which clients have accessed which keys.
   * 
   * When the tracked key is modified, invalidation messages are sent to all clients to notify them 
   * their cached values are no longer valid. This value enables you to specify the upper bound of this 
   * table. After this parameter value is exceeded, clients are sent invalidation randomly. This value 
   * should be tuned to limit memory usage while still keeping track of enough keys. Keys are also 
   * invalidated under low memory conditions.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default 1000000
   */
  @metadata
  readonly trackingTableMaxKeys?: number;

  /**
   * This value corresponds to the max number of entries in the ACL log.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default 128
   */
  @metadata
  readonly acllogMaxLen?: number;

  /**
   * Redis deletes keys that have exceeded their time to live by two mechanisms. In one, 
   * a key is accessed and is found to be expired. In the other, a periodic job samples 
   * keys and causes those that have exceeded their time to live to expire. This parameter 
   * defines the amount of effort that Redis uses to expire items in the periodic job.
   * 
   * The default value of 1 tries to avoid having more than 10 percent of expired keys still 
   * in memory. It also tries to avoid consuming more than 25 percent of total memory and to 
   * add latency to the system. You can increase this value up to 10 to increase the amount 
   * of effort spent on expiring keys. The tradeoff is higher CPU and potentially higher latency. 
   * We recommend a value of 1 unless you are seeing high memory usage and can tolerate an 
   * increase in CPU utilization.
   * 
   * Modifiable: Yes, Changes take effect: Immediately across all nodes in the cluster
   * 
   * @default 1
   */
  @metadata
  readonly activeExpireEffort?: number;

  /**
   * When the value is set to true, the DEL command acts the same as UNLINK.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default false
   */
  @metadata
  readonly lazyfreeLazyUserDel?: boolean;

  /**
   * Default pubsub channel permissions for ACL users deployed to this cluster.
   * 
   * Modifiable: Yes, changes take effect: The existing Redis users associated to the cluster 
   * will continue to have existing permissions. Either update the users or reboot the cluster 
   * to update the existing Redis users.
   * 
   * @default ALLCHANNELS
   */
  @metadata
  readonly aclPubsubDefault?: PubSubACL;

  /** 
   * DEPRECATED
   * 
   * @deprecated removed in 6.0 
   */
  @deprecate_metadata
  readonly luaReplicateCommands?: boolean;
}

export interface IParameterBase {
  readonly cacheParameterGroupFamily: string;
  toParameterGroup(): ParameterGroupContents;
}

abstract class RedisParameterBase implements IParameterBase {
  readonly props: RedisParameterPropsBase;
  readonly cacheParameterGroupFamily: string;
  static readonly propsType: typeof RedisParameterPropsBase;
  static readonly defaults: RedisParameterPropsBase;

  constructor(cacheParameterGroupFamily: string, props: RedisParameterPropsBase) {
    this.props = props;
    this.cacheParameterGroupFamily = cacheParameterGroupFamily;
    this.validateParameters()
  }

  public validateParameters() {
    //console.log(this.props.constructor.name)
    const tp = (this.constructor as typeof RedisParameterBase).propsType;
    const defaults = (this.constructor as typeof RedisParameterBase).defaults;
    for(const key of tp.nonModifiableKeys) {
      if ((this.props as any)[key] != undefined) {
        throw new Error(`Non-modifiable parameter ${key} was sepcified`);
      }
    }
  }

  public toParameterGroup(): ParameterGroupContents {
    const result: ParameterGroupContents = {};
    for(const [key, value] of Object.entries(this.props)) {
      let valueToStore = value;
      if (typeof value === 'boolean') {
        valueToStore = value ? 'yes' : 'no';
      }
      if (key == 'rename_commands') {
        // todo validate command
        const renames: string[] = [];
        for(const [name, rename] of Object.entries(value)) {
          if (!renamableCommands.includes(name)) {
            throw new Error(`Command ${name} is not renamable.`)
          }
          renames.push(`${name} ${rename}`);
        }
        valueToStore = renames.join(' ');
      }
      if (key == 'notify_keyspace_events') {
        if (value) {
          valueToStore = notifyKeySpaceEventsToString(value as NotifyKeySpaceEvents)
        }
      }
      const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      const defaults = (this.constructor as typeof RedisParameterBase).defaults;
      if (valueToStore !== undefined && (defaults as any)[key] !== value) {
        result[camelToSnakeCase(key).split('_').join('-')] = valueToStore.toString();
      }
    }
    return result;
  }
}

export class RedisParameter26 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps26 = {
    activerehashing: true,
    appendonly: false,
    appendfsync: ApppendFSync.EVERY_SECOND,
    clientOutputBufferLimitNormalHardLimit: 0,
    clientOutputBufferLimitNormalSoftLimit: 0,
    clientOutputBufferLimitNormalSoftSeconds: 0,
    clientOutputBufferLimitPubsubHardLimit: 33554432,
    clientOutputBufferLimitPubsubSoftLimit: 8388608,
    clientOutputBufferLimitPubsubSoftSeconds: 60,
    hashMaxZiplistEntries: 512,
    hashMaxZiplistValue: 64,
    listMaxZiplistEntries: 512,
    listMaxZiplistValue: 64,
    maxmemoryPolicy: MaxMemoryPolicy.VOLATILE_LRU,
    maxmemorySamples: 3,
    reservedMemory: 0,
    setMaxIntsetEntries: 512,
    slowlogLogSlowerThan: 10000,
    slowlogMaxLen: 128,
    tcpKeepalive: 0,
    timeout: 0,
    zsetMaxZiplistEntries: 128,
    zsetMaxZiplistValue: 64,
    // non modifiables
    databases: undefined,
    clientOutputBufferLimitSlaveSoftLimit: undefined,
    clientOutputBufferLimitSlaveSoftSeconds: undefined,
    luaTimeLimit: undefined,
    maxclients: undefined,                                 // node-type dependant
    slaveAllowChaining: undefined,
  }

  public static propsType = RedisParameterProps26;

  constructor(readonly props: RedisParameterProps26) {
    super('redis2.6', props)
  }
}

export class RedisParameter28 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps28 = {
    ...RedisParameter26.defaults,
    closeOnSlaveWrite: true,
    minSlavesMaxLag: 10,
    minSlavesToWrite: 0,
    notifyKeyspaceEvents: NotifyKeySpaceEvents.NONE,
    replBacklogSize: 1048576,
    replBacklogTtl: 3600,
    replTimeout: 60,
  }

  public static propsType = RedisParameterProps28;

  constructor(readonly props: RedisParameterProps28) {
    super('redis2.8', props);
  }
}

// remove the deprecated properties
function createPropertyDefaults32() {
  const { appendonly, ...result } = RedisParameter28.defaults;
  return result
}

export class RedisParameter32 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps32 = {
    ...createPropertyDefaults32(),
    activerehashing: undefined, // this parameter is no longer modifiable
    clusterEnabled: false, // todo this depends!!
    clusterRequireFullCoverage: false,
    hllSparseMaxBytes: 3000,
    listCompressDepth: 0,
    listMaxZiplistSize: -2,
    reservedMemoryPercent: 25,
  }

  public static propsType = RedisParameterProps32;

  constructor(readonly props: RedisParameterProps32) {
    super('redis3.2', props);
  }
}

export class RedisParameter40 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps40 = {
    ...RedisParameter32.defaults,
    activedefrag: false,
    activeDefragCycleMax: 75,
    activeDefragCycleMin: 25,
    activeDefragIgnoreBytes: 104857600,
    activeDefragThresholdLower: 10,
    activeDefragThresholdUpper: 100,
    clientQueryBufferLimit: 1073741824,
    lazyfreeLazyEviction: false,
    lazyfreeLazyExpire: false,
    lazyfreeLazyServerDel: false,
    lfuDecayTime: 1,
    lfuLogFactor: 10,
    protoMaxBulkLen: 536870912,
    slaveLazyFlush: false
  };

  public static propsType = RedisParameterProps40;

  constructor(readonly props: RedisParameterProps40) {
    super('redis4.0', props);
  }
}

// remove the deprecated properties
function createPropertyDefaults50() {
  const { 
    clientOutputBufferLimitSlaveSoftLimit, 
    clientOutputBufferLimitSlaveSoftSeconds,
    closeOnSlaveWrite,
    minSlavesMaxLag,
    minSlavesToWrite,
    slaveAllowChaining,
    slaveLazyFlush,
    ...result
  } = RedisParameter40.defaults;
  return result
}

export class RedisParameter50 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps50 = {
    ...createPropertyDefaults50(),
    activeDefragMaxScanFields: 1000,
    clientOutputBufferLimitReplicaHardLimit: 0,
    clientOutputBufferLimitReplicaSoftLimit: 0,
    clientOutputBufferLimitReplicaSoftSeconds: 60,
    closeOnReplicaWrite: true,
    luaReplicateCommands: true,
    minReplicasMaxLag: 10,
    minReplicasToWrite: 0,
    renameCommands: {},
    replicaAllowChaining: false,
    replicaIgnoreMaxmemory: true,
    replicaLazyFlush: true,
    streamNodeMaxBytes: 4096,
    streamNodeMaxEntries: 100,
  };

  public static propsType = RedisParameterProps50;

  constructor(readonly props: RedisParameterProps50) {
    super('redis5.0', props);
  }
}

// remove the deprecated properties
function createPropertyDefaults6X() {
  const { 
    luaReplicateCommands,
    ...result
  } = RedisParameter50.defaults;
  return result
}

export class RedisParameter6X extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps6X = {
    ...createPropertyDefaults6X(),
    clusterAllowReadsWhenDown: false,
    trackingTableMaxKeys: 1000000,
    acllogMaxLen: 128,
    activeExpireEffort: 1,
    lazyfreeLazyUserDel: false,
    aclPubsubDefault: PubSubACL.ALLCHANNELS,
  };

  public static propsType = RedisParameterProps6X;

  constructor(readonly props: RedisParameterProps6X) {
    super('redis6.x', props);
  }
}

// resource stuff below

export interface ParameterGroupProps {
  readonly description: string;

  readonly overrides: IParameterBase;
}

export interface IParameterGroup {
  readonly parameterGroupName: string;
}

export class ParameterGroup extends Resource implements IParameterGroup {
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: ParameterGroupProps) {
    super(scope, id);

    // Using 'Default' as the resource id for historical reasons (usage from `Instance` and `Cluster`).
    const securityGroup = new CfnParameterGroup(this, 'Default', {
      cacheParameterGroupFamily: props.overrides.cacheParameterGroupFamily,
      description: props.description,
      properties: props.overrides.toParameterGroup(),
    });

    this.parameterGroupName = securityGroup.ref;
  }
}