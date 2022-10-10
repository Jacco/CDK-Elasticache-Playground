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
    KEYSPACE = 1 << 0,      // K
    /**
     * E — Key-event events, published with a prefix of __keyevent@<db>__
     */
    KEY_EVENT = 1 << 1,     // E 
    /**
     * g — Generic, non-specific commands such as DEL, EXPIRE, RENAME, etc.
     */
    GENERIC = 1 << 2,       // g
    /**
     * $ — String commands
     */
    STRING = 1 << 3,        // $
    /**
     * l — List commands
     */
    LIST = 1 << 4,          // l
    /**
     * s — Set commands
     */
    SET = 1 << 5,           // s
    /**
     * h — Hash commands
     */
    HASH = 1 << 6,          // h
    /**
     * z — Sorted set commands
     */
    SORTED = 1 << 7,        // z
    /**
     * x — Expired events (events generated every time a key expires)
     */
    EXPIRED = 1 << 8,       // x
    /**
     * e — Evicted events (events generated when a key is evicted for maxmemory)
     */
    EVICTED = 1 << 9,       // e
    /**
     * A — An alias for g$lshzxe
     */
    ALL_COMMANDS = 1 << 10, // A
}

export namespace NotifyKeySpaceEvents {
  export function toString(value: NotifyKeySpaceEvents): string {
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


export class RenameCommands {
  APPEND?: string;
  AUTH?: string;
  BITCOUNT?: string;
  BITFIELD?: string;
  BITOP?: string;
  BITPOS?: string;
  BLPOP?: string;
  BRPOP?: string;
  BRPOPLPUSH?: string;
  BZPOPMIN?: string;
  BZPOPMAX?: string;
  CLIENT?: string;
  CLUSTER?: string;
  COMMAND?: string;
  DBSIZE?: string;
  DECR?: string;
  DECRBY?: string;
  DEL?: string;
  DISCARD?: string;
  DUMP?: string;
  ECHO?: string;
  EVAL?: string;
  EVALSHA?: string;
  EXEC?: string;
  EXISTS?: string;
  EXPIRE?: string;
  EXPIREAT?: string;
  FLUSHALL?: string;
  FLUSHDB?: string;
  GEOADD?: string;
  GEOHASH?: string;
  GEOPOS?: string;
  GEODIST?: string;
  GEORADIUS?: string;
  GEORADIUSBYMEMBER?: string;
  GET?: string;
  GETBIT?: string;
  GETRANGE?: string;
  GETSET?: string;
  HDEL?: string;
  HEXISTS?: string;
  HGET?: string;
  HGETALL?: string;
  HINCRBY?: string;
  HINCRBYFLOAT?: string;
  HKEYS?: string;
  HLEN?: string;
  HMGET?: string;
  HMSET?: string;
  HSET?: string;
  HSETNX?: string;
  HSTRLEN?: string;
  HVALS?: string;
  INCR?: string;
  INCRBY?: string;
  INCRBYFLOAT?: string;
  INFO?: string;
  KEYS?: string;
  LASTSAVE?: string;
  LINDEX?: string;
  LINSERT?: string;
  LLEN?: string;
  LPOP?: string;
  LPUSH?: string;
  LPUSHX?: string;
  LRANGE?: string;
  LREM?: string;
  LSET?: string;
  LTRIM?: string;
  MEMORY?: string;
  MGET?: string;
  MONITOR?: string;
  MOVE?: string;
  MSET?: string;
  MSETNX?: string;
  MULTI?: string;
  OBJECT?: string;
  PERSIST?: string;
  PEXPIRE?: string;
  PEXPIREAT?: string;
  PFADD?: string;
  PFCOUNT?: string;
  PFMERGE?: string;
  PING?: string;
  PSETEX?: string;
  PSUBSCRIBE?: string;
  PUBSUB?: string;
  PTTL?: string;
  PUBLISH?: string;
  PUNSUBSCRIBE?: string;
  RANDOMKEY?: string;
  READONLY?: string;
  READWRITE?: string;
  RENAME?: string;
  RENAMENX?: string;
  RESTORE?: string;
  ROLE?: string;
  RPOP?: string;
  RPOPLPUSH?: string;
  RPUSH?: string;
  RPUSHX?: string;
  SADD?: string;
  SCARD?: string;
  SCRIPT?: string;
  SDIFF?: string;
  SDIFFSTORE?: string;
  SELECT?: string;
  SET?: string;
  SETBIT?: string;
  SETEX?: string;
  SETNX?: string;
  SETRANGE?: string;
  SINTER?: string;
  SINTERSTORE?: string;
  SISMEMBER?: string;
  SLOWLOG?: string;
  SMEMBERS?: string;
  SMOVE?: string;
  SORT?: string;
  SPOP?: string;
  SRANDMEMBER?: string;
  SREM?: string;
  STRLEN?: string;
  SUBSCRIBE?: string;
  SUNION?: string;
  SUNIONSTORE?: string;
  SWAPDB?: string;
  TIME?: string;
  TOUCH?: string;
  TTL?: string;
  TYPE?: string;
  UNSUBSCRIBE?: string;
  UNLINK?: string;
  UNWATCH?: string;
  WAIT?: string;
  WATCH?: string;
  ZADD?: string;
  ZCARD?: string;
  ZCOUNT?: string;
  ZINCRBY?: string;
  ZINTERSTORE?: string;
  ZLEXCOUNT?: string;
  ZPOPMAX?: string;
  ZPOPMIN?: string;
  ZRANGE?: string;
  ZRANGEBYLEX?: string;
  ZREVRANGEBYLEX?: string;
  ZRANGEBYSCORE?: string;
  ZRANK?: string;
  ZREM?: string;
  ZREMRANGEBYLEX?: string;
  ZREMRANGEBYRANK?: string;
  ZREMRANGEBYSCORE?: string;
  ZREVRANGE?: string;
  ZREVRANGEBYSCORE?: string;
  ZREVRANK?: string;
  ZSCORE?: string;
  ZUNIONSTORE?: string;
  SCAN?: string;
  SSCAN?: string;
  HSCAN?: string;
  ZSCAN?: string;
  XINFO?: string;
  XADD?: string;
  XTRIM?: string;
  XDEL?: string;
  XRANGE?: string;
  XREVRANGE?: string;
  XLEN?: string;
  XREAD?: string;
  XGROUP?: string;
  XREADGROUP?: string;
  XACK?: string;
  XCLAIM?: string;
  XPENDING?: string;
  GEORADIUS_RO?: string;
  GEORADIUSBYMEMBER_RO?: string;
  LOLWUT?: string;
  XSETID?: string;
  SUBSTR?: string;
}

console.log(NotifyKeySpaceEvents.toString(NotifyKeySpaceEvents.EVICTED | NotifyKeySpaceEvents.GENERIC));

//const x: NotifyKeySpaceEvents = NotifyKeySpaceEvents.ALL_COMMANDS;
//NotifyKeySpaceEvents.toString(x);

export class RedisParameterPropsBase {
    [id: string]: any;
}

export class RedisParameterProps2_6 {
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
  readonly appendonly?: boolean;

  /**
   * When appendonly is set to yes, controls how often the AOF output buffer is written to disk.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * >= 2.8.22 unsupported
   */
  readonly appendfsync?: ApppendFSync;

  /**
   * If a client's output buffer reaches the specified number of bytes, the client will be 
   * disconnected.
   * 
   * @default 0 No hard limit
   */
  readonly client_output_buffer_limit_normal_hard_limit?: number;

  /**
   * If a client's output buffer reaches the specified number of bytes, the client will be 
   * disconnected, but only if this condition persists for client-output-buffer-limit-normal-soft-seconds. 
   * 
   * @default 0 No soft limit
   */
  readonly client_output_buffer_limit_normal_soft_limit?: number;

  /**
   * If a client's output buffer remains at client-output-buffer-limit-normal-soft-limit bytes for longer
   * than this number of seconds, the client will be disconnected.
   * 
   * @default 0 No time limit
   */
  readonly client_output_buffer_limit_normal_soft_seconds?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer reaches the specified number of bytes, 
   * the client will be disconnected.
   * 
   * @default 33554432
   */
  readonly client_output_buffer_limit_pubsub_hard_limit?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer reaches the specified number of bytes, 
   * the client will be disconnected, but only if this condition persists for 
   * client-output-buffer-limit-pubsub-soft-seconds.
   * 
   * @default 8388608
   */
  readonly client_output_buffer_limit_pubsub_soft_limit?: number;

  /**
   * For Redis publish/subscribe clients: If a client's output buffer remains at 
   * client-output-buffer-limit-pubsub-soft-limit bytes for longer than this number of seconds, the client
   * will be disconnected.
   * 
   * @default 60
   */
  readonly client_output_buffer_limit_pubsub_soft_seconds?: number;

  readonly client_output_buffer_limit_slave_soft_limit?: string;
  readonly client_output_buffer_limit_slave_soft_seconds?: string;

  /**
   * The number of logical partitions the databases is split into. We recommend keeping this value low.
   * This value is set when you create the parameter group. When assigning a new parameter group to a cluster, 
   * this value must be the same in both the old and new parameter groups.
   * 
   * @default 16
   */
  readonly databases?: number;

  /**
   * Determines the amount of memory used for hashes. Hashes with fewer than the specified number of entries 
   * are stored using a special encoding that saves space.
   * 
   * @default 512
   */
  readonly hash_max_ziplist_entries?: number;

  /**
   * Determines the amount of memory used for hashes. Hashes with entries that are smaller than the specified 
   * number of bytes are stored using a special encoding that saves space.
   * 
   * @default 64
   */
  readonly hash_max_ziplist_value?: number;

  /** 
   * Determines the amount of memory used for lists. Lists with fewer than the specified number of entries are 
   * stored using a special encoding that saves space.
   * 
   * @default 512
   */
  readonly list_max_ziplist_entries?: number; //(>= 3.2.4 unsupported)

  /**
   * Determines the amount of memory used for lists. Lists with entries that are smaller than the specified 
   * number of bytes are stored using a special encoding that saves space.
   * 
   * @default 64
   */
  readonly list_max_ziplist_value?: number; //(>= 3.2.4 unsupported)

  readonly lua_time_limit?: string;
  readonly maxclients?: string;

  /**
   * The eviction policy for keys when maximum memory usage is reached.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * @default VOLATILE_LRU
   */
  readonly maxmemory_policy?: MaxMemoryPolicy; // 4.0.10 values changed

  /**
   * For least-recently-used (LRU) and time-to-live (TTL) calculations, this parameter represents the sample size of keys to check. By default, Redis chooses 3 keys and uses the one that was used least recently.
   * 
   * Modifiable: Yes, changes Take Effect: Immediately
   * 
   * @default 3
   */
  readonly maxmemory_samples?: number;

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
  readonly reserved_memory?: number;
  readonly set_max_intset_entries?: string;
  readonly slave_allow_chaining?: string;
  readonly slowlog_log_slower_than?: string;
  readonly slowlog_max_len?: string;
  readonly tcp_keepalive?: string; // (>= 3.2.4 default from 0 -> 300)

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
  readonly timeout?: string;
  readonly zset_max_ziplist_entries?: string;
  readonly zset_max_ziplist_value?: string;
}

export class RedisParameterProps2_8 extends RedisParameterProps2_6 {
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
  readonly min_slaves_max_lag?: string;      // later renamed
  /**
   * The minimum number of read replicas which must be available in order for the primary node 
   * to accept writes from clients. If the number of available replicas falls below this number, 
   * then the primary node will no longer accept write requests. If either this parameter or 
   * min-slaves-max-lag is 0, then the primary node will always accept writes requests, even if 
   * no replicas are available.
   */
  readonly min_slaves_to_write?: string;     // later renamed
  readonly notify_keyspace_events?: NotifyKeySpaceEvents;

  // (from 2.8.22, repl-backlog-size applies to the primary cluster as well as to replica clusters)
  readonly repl_backlog_size?: string;
  readonly repl_backlog_ttl?: string;

  // >= 2.8.22, the repl-timeout unsupported (default is used), 6.0 unsupprted
  readonly repl_timeout?: string;

  // from 2.8.23
  readonly close_on_slave_write?: string;
}

export class RedisParameterProps3_2 extends RedisParameterProps2_8 {
  /**
   * @deprecated
   */
  readonly appendonly?: boolean;

  // from 3.2.4
  readonly list_max_ziplist_size?: string;
  readonly list_compress_depth?: string;
  readonly cluster_enabled?: string;
  readonly cluster_require_full_coverage?: string;
  readonly hll_sparse_max_bytes?: string;
  readonly reserved_memory_percent?: string;
}

export class RedisParameterProps4_0 extends RedisParameterProps3_2 {
  /**
   * Performs an asynchronous delete on evictions.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  readonly lazyfree_lazy_eviction?: boolean;

  /**
   * Performs an asynchronous delete on expired keys.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default no
   */
  readonly lazyfree_lazy_expire?: boolean;

  /**
   * Performs an asynchronous delete for commands which update values.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default false
   */
  readonly lazyfree_lazy_server_del?: boolean;

  /* TODO should we have modifiable No params here? */
  /**
   * Changes take place: N/A	Performs an asynchronous flushDB during slave sync.
   * 
   * Modifiable: No
   * 
   * @default false
   */
  readonly slave_lazy_flush?: boolean;

  /**
   * Set the log factor, which determines the number of key hits to saturate the key counter.
   * 
   * Permitted values: any integer > 0
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 10
   */
  readonly lfu_log_factor?: number;

  /**
   * The amount of time in minutes to decrement the key counter.
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 1
   */
  readonly lfu_decay_time?: number;

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
  readonly active_defrag_ignore_bytes?: number;

  /**
   * Minimum percentage of fragmentation to start active defrag.
   * 
   * Permitted values: 1-100
   * 
   * Modifiable: Yes, changes take place: immediately
   *
   * @default 10 
   */
  readonly active_defrag_threshold_lower?: number;

  /**
   * Maximum percentage of fragmentation at which we use maximum effort.
   * 
   * Permitted values: 1-100
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 100
   */
  readonly active_defrag_threshold_upper?: number;

  /**
   * Minimal effort for defrag in CPU percentage.
   * 
   * Permitted values: 1-75
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 25
   */
  readonly active_defrag_cycle_min?: number;

  /** 
   * Maximal effort for defrag in CPU percentage.
   * 
   * Permitted values: 1-75
   * 
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 75
   */
  readonly active_defrag_cycle_max?: number;

  /**
   * Max size of a single client query buffer.
   * 
   * Permitted values: 1048576-1073741824
   * Modifiable: Yes, changes take place: immediately
   * 
   * @default 1073741824
   */
   readonly client_query_buffer_limit?: number;

   /**
    * Max size of a single element request.
    * 
    * Permitted values: 1048576-536870912
    * Modifiable: Yes, changes take place: immediately
    * 
    * @default 536870912
    */
   readonly proto_max_bulk_len?: number;
}

export class RedisParameterProps5_0 extends RedisParameterProps4_0 {
  /**
   * Performs an asynchronous flushDB during replica sync. (renamed from: slave-lazy-flush)
   * 
   * Modifiable: No
   * 
   * @default true
   */
  readonly replica_lazy_flush?: boolean;
  /** @deprecated */
  readonly slave_lazy_flush?: boolean;

  /**
   * For Redis read replicas: If a client's output buffer reaches the specified number 
   * of bytes, the client will be disconnected. (renamed from: client-output-buffer-limit-slave-hard-limit)
   * 
   * Modifiable: No
   * 
   * @efault For values see Redis node-type specific parameters
   */
  readonly client_output_buffer_limit_replica_hard_limit?: number;
  /** @deprecated */
  readonly client_output_buffer_limit_slave_hard_limit?: number;

  readonly client_output_buffer_limit_replica_soft_limit?: string;
  readonly client_output_buffer_limit_replica_soft_seconds?: string;
  readonly replica_allow_chaining?: string;
  readonly min_replicas_to_write?: string;
  readonly min_replicas_max_lag?: string;
  readonly close_on_replica_write?: string;
  // 5.0
  readonly stream_node_max_bytes?: string;
  readonly stream_node_max_entries?: string;
  readonly active_defrag_max_scan_fields?: string;
  // removed 6.0
  readonly lua_replicate_commands?: string;
  readonly replica_ignore_maxmemory?: string;

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
  readonly rename_commands?: RenameCommands;
}

export class RedisParameterProps6_X extends RedisParameterProps5_0 {
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
  readonly cluster_allow_reads_when_down?: boolean;

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
  readonly tracking_table_max_keys?: number;

  /**
   * This value corresponds to the max number of entries in the ACL log.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default 128
   */
  readonly acllog_max_len?: number;

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
  readonly active_expire_effort?: number;

  /**
   * When the value is set to true, the DEL command acts the same as UNLINK.
   * 
   * Modifiable: Yes, changes take effect: Immediately across all nodes in the cluster
   * 
   * @default false
   */
  readonly lazyfree_lazy_user_del?: boolean;

  /**
   * Default pubsub channel permissions for ACL users deployed to this cluster.
   * 
   * Modifiable: Yes, changes take effect: The existing Redis users associated to the cluster 
   * will continue to have existing permissions. Either update the users or reboot the cluster 
   * to update the existing Redis users.
   * 
   * @default ALLCHANNELS
   */
  readonly acl_pubsub_default?: PubSubACL;
}

export interface IParameterBase {
  readonly cacheParameterGroupFamily: string;
  toParameterGroup(): ParameterGroupContents;
}

class RedisParameterBase implements IParameterBase {
  readonly props: RedisParameterPropsBase;
  readonly cacheParameterGroupFamily: string;
  readonly defaults: RedisParameterPropsBase;

  constructor(cacheParameterGroupFamily: string, props: RedisParameterPropsBase, defaults: RedisParameterPropsBase) {
    this.props = props;
    this.cacheParameterGroupFamily = cacheParameterGroupFamily
  }

  public toParameterGroup(): ParameterGroupContents {
    const result: ParameterGroupContents = {};
    for(const [key, value] of Object.entries(this.props)) {
      let valueToStore = value;
      if (typeof value === 'boolean') {
        valueToStore = value ? 'yes' : 'no';
      }
      if (value instanceof RenameCommands) {
        // todo make rename string
      }
      if (valueToStore !== undefined && this.defaults[key] !== value) {
        result[key.split('_').join('-')] = valueToStore.toString();
      }
    }
    return result;
  }
}

const redisParameterDefaults2_6: RedisParameterProps2_6 = {
  activerehashing: true,
  appendonly: false,
  appendfsync: ApppendFSync.EVERY_SECOND,
  client_output_buffer_limit_normal_hard_limit: 0,
  client_output_buffer_limit_normal_soft_limit: 0,
  client_output_buffer_limit_normal_soft_seconds: 0,
  client_output_buffer_limit_pubsub_hard_limit: 33554432,
  client_output_buffer_limit_pubsub_soft_limit: 8388608,
  client_output_buffer_limit_pubsub_soft_seconds: 60,
  databases: 16,
};

export class RedisParameter2_6 extends RedisParameterBase {
  constructor(props: RedisParameterProps2_6) {
    super('redis2.6', props, redisParameterDefaults2_6)
  }
}

const redisParameterDefaults2_8: RedisParameterProps2_8 = {
  ...redisParameterDefaults2_6,
};

export class RedisParameter2_8 extends RedisParameterBase {
  constructor(props: RedisParameterProps2_8) {
    super('redis2.8', props, redisParameterDefaults2_8);
  }
}

const redisParameterDefaults3_2: RedisParameterProps3_2 = {
  ...redisParameterDefaults2_8,
};

export class RedisParameter3_2 extends RedisParameterBase {
  constructor(props: RedisParameterProps3_2) {
    super('redis3.2', props, redisParameterDefaults3_2);
  }
}

const redisParameterDefaults4_0: RedisParameterProps4_0 = {
  ...redisParameterDefaults3_2,
};

export class RedisParameter4_0 extends RedisParameterBase {
  constructor(props: RedisParameterProps4_0) {
    super('redis4.0', props, redisParameterDefaults4_0);
  }
}

const redisParameterDefaults5_0: RedisParameterProps5_0 = {
  ...redisParameterDefaults4_0,
};

export class RedisParameter5_0 extends RedisParameterBase {
  constructor(props: RedisParameterProps5_0) {
    super('redis5.0', props, redisParameterDefaults5_0);
  }
}

const redisParameterDefaults6_X: RedisParameterProps6_X = {
  ...redisParameterDefaults5_0,
  cluster_allow_reads_when_down: false,
  tracking_table_max_keys: 1000000,
  acllog_max_len: 128,
  active_expire_effort: 1,
  lazyfree_lazy_user_del: false,
  acl_pubsub_default: PubSubACL.ALLCHANNELS,
};

export class RedisParameter6_X extends RedisParameterBase {
  constructor(props: RedisParameterProps6_X) {
    super('redis6.x', props, redisParameterDefaults6_X);
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