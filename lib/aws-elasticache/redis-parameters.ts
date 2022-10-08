// memcached1.4 | memcached1.5 | memcached1.6
// redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x

type ParameterGroup = { [id: string] : string; };

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
  readonly maxmemory_policy?: string; // 4.0.10 values changed
  readonly maxmemory_samples?: string;
  readonly reserved_memory?: string;
  readonly set_max_intset_entries?: string;
  readonly slave_allow_chaining?: string;
  readonly slowlog_log_slower_than?: string;
  readonly slowlog_max_len?: string;
  readonly tcp_keepalive?: string; // (>= 3.2.4 default from 0 -> 300)

  /**
   * The number of seconds a node waits before timing out. Values are: 
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

  // 4.0.10
  readonly lazyfree_lazy_eviction?: string;
  readonly lazyfree_lazy_expire?: string;
  readonly lazyfree_lazy_server_del?: string;
  readonly slave_lazy_flush?: string;
  readonly lfu_log_factor?: string;
  readonly lfu_decay_time?: string;
  readonly proto_max_bulk_len?: string;
  readonly client_query_buffer_limit?: string;
  readonly activedefrag?: string;
  readonly active_defrag_ignore_bytes?: string;
  readonly active_defrag_threshold_lower?: string;
  readonly active_defrag_threshold_upper?: string;
  readonly active_defrag_cycle_min?: string;
  readonly active_defrag_cycle_max?: string;

  // 5.0 (renames?)
  readonly replica_lazy_flush?: string;
  readonly client_output_buffer_limit_replica_hard_limit?: string;
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
  readonly lua_replicate_commands ?: string;
  readonly replica_ignore_maxmemory?: string;

  // 5.0.3
  readonly rename_commands?: string;

  // 6.0
  readonly cluster_allow_reads_when_down?: string;
  readonly tracking_table_max_keys?: string;
  readonly acllog_max_len?: string;
  readonly active_expire_effort?: string;
  readonly lazyfree_lazy_user_del?: string;

  // 6.2
  readonly acl_pubsub_default?: string;
}

export class RedisParameterProps_2_8 extends RedisParameterProps2_6 {
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

export class RedisParameterProps3_2 extends RedisParameterProps2_6 {
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

class RedisParameterBase {
  props: RedisParameterPropsBase;

  constructor(props: RedisParameterPropsBase) {
    this.props = props;
  }

  public toParameterGroup(): ParameterGroup {
    const result: ParameterGroup = {};
    for(const [key, value] of Object.entries(this.props)) {
      let valueToStore = value;
      if (typeof value === 'boolean') {
        valueToStore = value ? 'yes' : 'no';
      }
      if (valueToStore !== undefined && redisParameterDefaults.props[key] !== value) {
        result[key.split('_').join('-')] = valueToStore;
      }
    }
    return result;
  }
}

export class RedisParameter extends RedisParameterBase {
  constructor(props: RedisParameterProps2_6) {
    super(props)
  }
}

const redisParameterDefaults = new RedisParameter({
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
});

export class RedisParameter3_2 extends RedisParameterBase {
  constructor(props: RedisParameterProps3_2) {
    super(props);
  }
}