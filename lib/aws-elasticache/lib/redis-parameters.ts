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

//console.log(NotifyKeySpaceEvents.toString(NotifyKeySpaceEvents.EVICTED | NotifyKeySpaceEvents.GENERIC));

//const x: NotifyKeySpaceEvents = NotifyKeySpaceEvents.ALL_COMMANDS;
//NotifyKeySpaceEvents.toString(x);

/**
 * Base class
 */
export class RedisParameterPropsBase {
  // getKeys(): string[] {
  //   const result: string[] = [] 
  //   for (const key of Object.keys(this)) {
  //     result.push(key);
  //   }
  //   return result;
  // }
  public static get parameterKeys(): string[] {
    return (RedisParameterProps26.prototype as any)[propertiesSymbol]
  }
}

const propertiesSymbol = Symbol('properties');

const metadata = (target: any, key: string) => {
  let list = <string[] | undefined>target[propertiesSymbol];
  if (list == undefined)
      list = target[propertiesSymbol] = [];
  list.push(key);
};

export class RedisParameterProps26 extends RedisParameterPropsBase { // <-- TODO can these be (internal) interfaces? I want to hide some implementation details
  /**
   * Determines whether to enable Redis' active rehashing feature. The main hash table is rehashed ten
   * times per second; each rehash operation consumes 1 millisecond of CPU time.
   * 
   * This value is set when you create the parameter group. When assigning a new parameter group to a cluster, 
   * this value must be the same in both the old and new parameter groups.
   * 
   * Modifiable: 
   * _ <  3.2.4 Yes, changes take place: At Creation
   * _ >= 3.2.4 No
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
   * >= 2.8.22 unsupported
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
   * @default 0 No hard limit
   */
   @metadata
   readonly clientOutputBufferLimitNormalHardLimit?: number;

  /**
   * If a client's output buffer reaches the specified number of bytes, the client will be 
   * disconnected, but only if this condition persists for client-output-buffer-limit-normal-soft-seconds. 
   * 
   * @default 0 No soft limit
   */
   @metadata
   readonly clientOutputBufferLimitNormalSoftLimit?: number;

  /**
   * If a client's output buffer remains at client-output-buffer-limit-normal-soft-limit bytes for longer
   * than this number of seconds, the client will be disconnected.
   * 
   * @default 0 No time limit
   */
   @metadata
   readonly clientOutputBufferLimitNormalSoftSeconds?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer reaches the specified number of bytes, 
   * the client will be disconnected.
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
   * @default 8388608
   */
   @metadata
   readonly clientOutputBufferLimitPubsubSoftLimit?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer remains at 
   * client-output-buffer-limit-pubsub-soft-limit bytes for longer than this number of seconds, the client
   * will be disconnected.
   * 
   * @default 60
   */
   @metadata
   readonly clientOutputBufferLimitPubsubSoftSeconds?: number;

   @metadata
   readonly clientOutputBufferLimitSlaveSoftLimit?: string;
   @metadata
   readonly clientOutputBufferLimitSlaveSoftSeconds?: string;

  /**
   * The number of logical partitions the databases is split into. We recommend keeping this value low.
   * This value is set when you create the parameter group. When assigning a new parameter group to a cluster, 
   * this value must be the same in both the old and new parameter groups.
   * 
   * @default 16
   */
   @metadata
   readonly databases?: number;

  /**
   * Determines the amount of memory used for hashes. Hashes with fewer than the specified number of entries 
   * are stored using a special encoding that saves space.
   * 
   * @default 512
   */
   @metadata
   readonly hashMaxZiplistEntries?: number;

  /**
   * Determines the amount of memory used for hashes. Hashes with entries that are smaller than the specified 
   * number of bytes are stored using a special encoding that saves space.
   * 
   * @default 64
   */
   @metadata
   readonly hashMaxZiplistValue?: number;

  /** 
   * Determines the amount of memory used for lists. Lists with fewer than the specified number of entries are 
   * stored using a special encoding that saves space.
   * 
   * @default 512
   */
   @metadata
   readonly listMaxZiplistEntries?: number; //(>= 3.2.4 unsupported)

  /**
   * Determines the amount of memory used for lists. Lists with entries that are smaller than the specified 
   * number of bytes are stored using a special encoding that saves space.
   * 
   * @default 64
   */
   @metadata
   readonly listMaxZiplistValue?: number; //(>= 3.2.4 unsupported)

   @metadata
   readonly luaTimeLimit?: string;
   @metadata
   readonly maxclients?: string;

  /**
   * The eviction policy for keys when maximum memory usage is reached.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * @default VOLATILE_LRU
   */
   @metadata
   readonly maxmemoryPolicy?: MaxMemoryPolicy; // 4.0.10 values changed

  /**
   * For least-recently-used (LRU) and time-to-live (TTL) calculations, this parameter represents the sample size of keys to check. By default, Redis chooses 3 keys and uses the one that was used least recently.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
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
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * @default 0
   */
  @metadata
  readonly reservedMemory?: number;
  @metadata
  readonly setMaxIntsetEntries?: string;
  @metadata
  readonly slaveAllowChaining?: string;
  @metadata
  readonly slowlogLogSlowerThan?: string;
  @metadata
  readonly slowlogMaxLen?: string;
  @metadata
  readonly tcpKeepalive?: string; // (>= 3.2.4 default from 0 -> 300)

  /**
   * The number of seconds a node waits before timing out. 
   * 
   * Values are: 
   * 
   * 0    – never disconnect an idle client.
   * 
   * 1-19 – invalid values.
   * 
   * >=20 – the number of seconds a node waits before disconnecting an idle client.
   * 
   * @default 0 Never disconnect
   */
  @metadata
  readonly timeout?: string;
  @metadata
  readonly zsetMaxZiplistEntries?: string;
  @metadata
  readonly zsetMaxZiplistValue?: string;
}

//for (const key of (RedisParameterProps2_6.prototype as any)[propertiesSymbol]) {
//  console.log(key);
//}

export class RedisParameterProps28 extends RedisParameterProps26 {
  // from 2.8.6
  /**
   * The number of seconds within which the primary node must receive a ping request from a 
   * read replica. If this amount of time passes and the primary does not receive a ping, 
   * then the replica is no longer considered available. If the number of available replicas 
   * drops below min-slaves-to-write, then the primary will stop accepting writes at that point.
   * 
   * If either this parameter or min-slaves-to-write is 0, then the primary node will always 
   * accept writes requests, even if no replicas are available.
   */
  readonly minSlavesMaxLag?: string;      // later renamed
  /**
   * The minimum number of read replicas which must be available in order for the primary node 
   * to accept writes from clients. If the number of available replicas falls below this number, 
   * then the primary node will no longer accept write requests. If either this parameter or 
   * min-slaves-max-lag is 0, then the primary node will always accept writes requests, even if 
   * no replicas are available.
   */
  readonly minSlavesToWrite?: string;     // later renamed
  readonly notifyKeyspaceEvents?: NotifyKeySpaceEvents;

  // (from 2.8.22, repl-backlog-size applies to the primary cluster as well as to replica clusters)
  readonly replBacklogSize?: string;
  readonly replBacklogTtl?: string;

  // >= 2.8.22, the repl-timeout unsupported (default is used), 6.0 unsupprted
  readonly replTimeout?: string;

  // from 2.8.23
  readonly closeOnSlaveWrite?: string;
}

export class RedisParameterProps32 extends RedisParameterProps28 {
  /** @deprecated removed in 3.2 */
  readonly appendonly?: boolean;

  // from 3.2.4
  readonly listMaxZiplistSize?: string;
  readonly listCompressDepth?: string;
  readonly clusterEnabled?: string;
  readonly clusterRequireFullCoverage?: string;
  readonly hllSparseMaxBytes?: string;
  readonly reservedMemoryOercent?: string;
}

export class RedisParameterProps40 extends RedisParameterProps32 {
  /**
   * Performs an asynchronous delete on evictions.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  readonly lazyfreeLazyEviction?: boolean;

  /**
   * Performs an asynchronous delete on expired keys.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default no
   */
  readonly lazyfreeLazyExpire?: boolean;

  /**
   * Performs an asynchronous delete for commands which update values.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  readonly lazyfreeLazyServerDel?: boolean;

  /* TODO should we have modifiable No params here? */
  /**
   * Changes take place: N/A	Performs an asynchronous flushDB during slave sync.
   * 
   * Modifiable: No
   * 
   * @default false
   */
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
  readonly lfuLogFactor?: number;

  /**
   * The amount of time in minutes to decrement the key counter.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 1
   */
  readonly lfuDecayTime?: number;

  /**
   * Enabled active defragmentation.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
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
  readonly activeDefragCycleMax?: number;

  /**
   * Max size of a single client query buffer.
   * 
   * Permitted values: 1048576-1073741824
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 1073741824
   */
   readonly clientQueryBufferLimit?: number;

   /**
    * Max size of a single element request.
    * 
    * Permitted values: 1048576-536870912
    * Modifiable: Yes, changes take place: immediately
    * 
    * @default 536870912
    */
   readonly protoMaxBulkLen?: number;
}

export class RedisParameterProps50 extends RedisParameterProps40 {
  /**
   * Performs an asynchronous flushDB during replica sync. (renamed from: slave-lazy-flush)
   * 
   * Modifiable: No
   * 
   * @default true
   */
  readonly replicaLazyFlush?: boolean;
  /** @deprecated renamed to replica_lazy_flush */
  readonly slaveLazyFlush?: boolean;

  /**
   * For Redis read replicas: If a client's output buffer reaches the specified number 
   * of bytes, the client will be disconnected. (renamed from: client-output-buffer-limit-slave-hard-limit)
   * 
   * Modifiable: No
   * 
   * @efault For values see Redis node-type specific parameters
   */
  readonly clientOutputBufferLimitReplicaHardLimit?: number;
  /** @deprecated renamed to clientoutputbufferlimitreplicahardlimit */
  readonly clientOutputBufferLimitSlaveHardLimit?: number;

  readonly clientOutputBufferLimitReplicaSoftLimit?: string;
  readonly clientOutputBufferLimitReplicaSoftSeconds?: string;
  readonly replicaAllowChaining?: string;
  readonly minReplicasToWrite?: string;
  readonly minReplicasMaxLag?: string;
  readonly closeOnReplicaWrite?: string;
  // 5.0
  readonly streamNodeMaxBytes?: string;
  readonly streamNodeMaxEntries?: string;
  readonly activeDefragMaxScanFields?: string;

  /**
   * Always enable Lua effect replication or not in Lua scripts
   * 
   * Modifiable: Yes, changes take effect: Immediately
   * 
   * @default true
   */
  readonly luaReplicateCommands?: boolean;

  /**
   * Determines if replica ignores maxmemory setting by not evicting items independent from the primary
   * 
   * Modifiable: No
   * 
   * @default true
   */
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
   * @default 1,000,000
   */
  readonly trackingTableMaxKeys?: number;

  /**
   * This value corresponds to the max number of entries in the ACL log.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default 128
   */
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
  readonly activeExpireEffort?: number;

  /**
   * When the value is set to true, the DEL command acts the same as UNLINK.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default false
   */
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
  readonly aclPubsubDefault?: PubSubACL;

  /** @deprecated removed in 6.0 */
  readonly luaReplicateCommands?: boolean;
}

export interface IParameterBase {
  readonly cacheParameterGroupFamily: string;
  toParameterGroup(): ParameterGroupContents;
}

abstract class RedisParameterBase implements IParameterBase {
  readonly props: RedisParameterPropsBase;
  readonly cacheParameterGroupFamily: string;
  static readonly defaults: RedisParameterPropsBase;

  constructor(cacheParameterGroupFamily: string, props: RedisParameterPropsBase) {
    this.props = props;
    this.cacheParameterGroupFamily = cacheParameterGroupFamily;
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
        result[camelToSnakeCase(key.split('_').join('-'))] = valueToStore.toString();
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
    databases: 16,
  }

  constructor(props: RedisParameterProps26) {
    super('redis2.6', props)
  }
}

export class RedisParameter28 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps28 = {
    ...RedisParameter26.defaults,
  }

  constructor(props: RedisParameterProps28) {
    super('redis2.8', props);
  }
}

export class RedisParameter32 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps32 = {
    ...RedisParameter28.defaults,
  }

  constructor(props: RedisParameterProps32) {
    super('redis3.2', props);
  }
}

export class RedisParameter40 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps40 = {
    ...RedisParameter32.defaults,
  };

  constructor(props: RedisParameterProps40) {
    super('redis4.0', props);
  }
}

export class RedisParameter50 extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps50 = {
    ...RedisParameter40.defaults,
  };

  constructor(props: RedisParameterProps50) {
    super('redis5.0', props);
  }
}

export class RedisParameter6X extends RedisParameterBase {
  public static readonly defaults: RedisParameterProps6X = {
    ...RedisParameter50.defaults,
    clusterAllowReadsWhenDown: false,
    trackingTableMaxKeys: 1000000,
    acllogMaxLen: 128,
    activeExpireEffort: 1,
    lazyfreeLazyUserDel: false,
    aclPubsubDefault: PubSubACL.ALLCHANNELS,
  };

  constructor(props: RedisParameterProps6X) {
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