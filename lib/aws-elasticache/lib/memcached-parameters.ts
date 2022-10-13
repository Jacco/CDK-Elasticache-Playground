export enum BindingProtocol {
  ASCII = "ascii",
  AUTO = "auto"
}

interface Memcached1_4_5 {
  /**
   * The backlog queue limit.
   * 
   * Modifiable: No
   * 
   * @default 1024
   */
  readonly backlog_queue_limit?: number;

  /**
   * The binding protocol. For guidance on modifying the value of binding_protocol, 
   * see Modifying a parameter group.
   * 
   * Modifiable: Yes, changes Take Effect: After restart
   * 
   * @default AUTO
   */
  readonly binding_protocol?: BindingProtocol;

  /**
   * If true, check and set (CAS) operations will be disabled, and items stored will 
   * consume 8 fewer bytes than with CAS enabled.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default false
   */
  readonly cas_disabled?: boolean;

  /**
   * The minimum amount, in bytes, of space to allocate for the smallest item's key, value, and flags.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default 48
   */
  readonly chunk_size?: number;

  /**
   * The growth factor that controls the size of each successive Memcached chunk; each chunk 
   * will be chunk_size_growth_factor times larger than the previous chunk.
   * 
   * Modifiable: Yes, changes take effect after restart
   *
   * @default 1.25 
   */
  readonly chunk_size_growth_factor?: number;

  /**
   * If true, when there is no more memory to store items, Memcached will return an error
   * rather than evicting items.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default false
   */
  readonly error_on_memory_exhausted?: boolean;

  /**
   * If true, ElastiCache will try to use large memory pages.
   * 
   * Modifiable: No
   * 
   * @default false
   */
  readonly large_memory_pages?: boolean;

  /**
   * If true, ElastiCache will lock down all paged memory.
   * 
   * Modifiable: No
   * 
   * @default false
   */
  readonly lock_down_paged_memory?: boolean;


  /**
   * The size, in bytes, of the largest item that can be stored in the cluster.
   * 
   * Modifiable: Yes, Changes Take Effect: After restart
   * 
   * @default 1048576
   */
  readonly max_item_size?: number;

  /**
   * The maximum number of simultaneous connections.
   * 
   * Modifiable: No
   * 
   * @default 65000
   */
  readonly max_simultaneous_connection?: number;

  /**
   * If true, ElastiCache will maximize the core file limit.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default false
   */
  readonly maximize_core_file_limit?: boolean;

  /**
   * The amount of memory to be reserved for Memcached connections and other 
   * miscellaneous overhead. For information about this parameter, see Memcached 
   * connection overhead.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default 100
   */
  readonly memcached_connections_overhead?: number;

  /**
   * The maximum number of requests per event for a given connection. This limit is 
   * required to prevent resource starvation.
   * 
   * Modifiable: No
   * 
   * @default 20
   */
  readonly requests_per_event?: number;	
}

const memcachedDefaults1_4_5: Memcached1_4_5 = {
  backlog_queue_limit: 1024,
  binding_protocol: BindingProtocol.AUTO,
  cas_disabled: false,
  chunk_size: 48,
  chunk_size_growth_factor: 1.25,
  error_on_memory_exhausted: false,
  large_memory_pages: false,
  lock_down_paged_memory: false,
  max_item_size: 1048576,
  max_simultaneous_connection: 65000,
  maximize_core_file_limit: false,
  memcached_connections_overhead: 100,
  requests_per_event: 20
}

interface Memcached1_4_14 extends Memcached1_4_5 {
  /**
   * The maximum number of ElastiCache configuration entries.
   * 
   * @default 16
   * 
   * Modifiable: No
   */
  readonly config_max?: number;
  
  /**
   * The maximum size of the configuration entries, in bytes.
   * 
   * Modifiable: No
   * 
   * @default 65536
   */
  readonly config_size_max?: number;

  /**
   * The initial size of the ElastiCache hash table, expressed as a power of two. The default
   * is 16 (2^16), or 65536 keys.
   * 
   * Modifiable: No
   * 
   * @default 16
   */
  readonly hashpower_init?: number;
  
  /**
   * Changes the way in which new connections requests are handled when the maximum connection 
   * limit is reached. If this parameter is set to 0 (zero), new connections are added to the
   * backlog queue and will wait until other connections are closed. If the parameter is set to 1,
   * ElastiCache sends an error to the client and immediately closes the connection.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default false
   */
  readonly maxconns_fast?: boolean;

  /**
   * Adjusts the slab automove algorithm: If this parameter is set to 0 (zero), the automove 
   * algorithm is disabled. If it is set to 1, ElastiCache takes a slow, conservative approach to 
   * automatically moving slabs. If it is set to 2, ElastiCache aggressively moves slabs whenever 
   * there is an eviction. (This mode is not recommended except for testing purposes.)
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default false
   */
  readonly slab_automove?: boolean;
  
  
  /**
   * Enable or disable slab reassignment. If this parameter is set to 1, you can use the 
   * "slabs reassign" command to manually reassign memory.
   * 
   * Modifiable: Yes, changes take effect after restart
   * 
   * @default false
   */
  readonly slab_reassign?: boolean;
}

const memcachedDefaults1_4_14: Memcached1_4_14 = {
  ...memcachedDefaults1_4_5,
  config_max: 16,
  config_size_max: 65536,
  hashpower_init: 15,
  maxconns_fast: false,
  slab_automove: false,
  slab_reassign: false
}

enum HashAlgorithm {
  JENKINS = "jenkins",
  MURMUR3 = "murmur3"
}

interface Memcached1_4_24 extends Memcached1_4_14 {
  /**
   * Add parameter (-F) to disable flush_all. Useful if you never want to be able 
   * to run a full flush on production instances. User can do a flush_all when the value is false.
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * @default false
   */
  readonly disable_flush_all?: boolean;
  
  /**
   * The hash algorithm to be used.
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * @default JENKINS
   */
  readonly hash_algorithm?: HashAlgorithm;
  
  /**
   * To temporarily enable, run lru_crawler enable at the command line. Enabling lru_crawler 
   * at the command line enables the crawler until either disabled at the command line or the 
   * next reboot. To enable permanently, you must modify the parameter value. For more information, 
   * see Modifying a parameter group.
   * 
   * Cleans slab classes of items that have expired. This is a low impact process that runs in the 
   * background. Currently requires initiating a crawl using a manual command.
   * 
   * TODO ??!? lru_crawler 1,3,5 crawls slab classes 1, 3, and 5 looking for expired items to add to the 
   * freelist.
   * 
   * Modifiable: Yes, Changes Take Effect: After restart
   * 
   * @default false
   */
  readonly lru_crawler?: boolean;
    
  /**
   * A background thread that shuffles items between the LRUs as capacities are reached.
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * @default false
   */
  readonly lru_maintainer?: boolean;

  /**
   * When used with lru_maintainer, makes items with an expiration time of 0 unevictable.
   * Can be set to disregard lru_maintainer.
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * Warning: This can crowd out memory available for other evictable items.
   * 
   * @default false
   */
  readonly expirezero_does_not_evict?: boolean;
}

const memcachedDefaults1_4_24: Memcached1_4_24 = {
  ...memcachedDefaults1_4_14,
  disable_flush_all: false,
  hash_algorithm: HashAlgorithm.JENKINS,
  lru_crawler: false,
  lru_maintainer: false,
  expirezero_does_not_evict: false,
}

interface Memcached1_4_33 extends Memcached1_4_24 {
  /**
   * An alias to multiple features. Enabling modern is equivalent to turning following commands
   * on and using a murmur3 hash algorithm: slab_reassign, slab_automove, lru_crawler, lru_maintainer,
   * maxconns_fast, and hash_algorithm=murmur3.
   * 
   * TODO alias!!
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * @default true
   */
  readonly modern?: boolean;

  /**
   * Logs can get dropped if user hits their watcher_logbuf_size and worker_logbuf_size limits.
   * 
   * Logs fetches, evictions or mutations. When, for example, user turns watch on, they can see 
   * logs when get, set, delete, or update occur.
   * 
   * Modifiable: Yes, Changes Take Effect: Immediately
   * 
   * @default true
   */
  readonly watch?: boolean;

  /**
   * The minimum number of seconds a client will be allowed to idle before being asked to close. 
   * Range of values: 0 to 86400.
   * 
   * Modifiable: Yes, Changes Take Effect: At Launch
   * 
   * @default 0
   */
  readonly idle_timeout?: number;

  /**
   * Shows the sizes each slab group has consumed.
   * 
   * Enabling track_sizes lets you run stats sizes without the need to run stats sizes_enable.
   * 
   * Modifiable: Yes, Changes Take Effect: At Launch
   * 
   * @default false
   */
  readonly track_sizes?: boolean;
  
  /**
   * The watch command turns on stream logging for Memcached. However watch can drop logs
   * if the rate of evictions, mutations or fetches are high enough to cause the logging
   * buffer to become full. In such situations, users can increase the buffer size to reduce
   * the chance of log losses.
   * 
   * Modifiable: Yes, Changes Take Effect: At Launch
   * 
   * @default 256 KB
   */
  readonly watcher_logbuf_size?: number;

  /**
   * The watch command turns on stream logging for Memcached. However watch can drop logs 
   * if the rate of evictions, mutations or fetches are high enough to cause logging buffer
   * get full. In such situations, users can increase the buffer size to reduce the chance
   * of log losses.
   * 
   * Modifiable: Yes, Changes Take Effect: At Launch
   * 
   * @default 64 KB
   */
  readonly worker_logbuf_size?: number;
  
  
  /**
   * Specifies the maximum size of a slab. Setting smaller slab size uses memory more 
   * efficiently. Items larger than slab_chunk_max are split over multiple slabs.
   * 
   * Modifiable: Yes, Changes Take Effect: At Launch
   * 
   * @default 524288 Bytes
   */
  readonly slab_chunk_max?: number;

  /**
   * TODO ??!? lru_crawler metadump [all|1|2|3] 
   */
}

const memcachedDefaults1_4_33: Memcached1_4_33 = {
  ...memcachedDefaults1_4_24,
  idle_timeout: 0,
  modern: true,
  slab_chunk_max: 524288,
  track_sizes: false,
  watch: true,
  watcher_logbuf_size: 256,
  worker_logbuf_size: 64
}

interface Memcached1_5_10 extends Memcached1_4_24 {
  /**
   * An alias for disabling slab_reassign, slab_automove, lru_crawler, lru_maintainer, 
   * maxconns_fast commands. No modern also sets the hash_algorithm to jenkins and 
   * allows inlining of ASCII VALUE. Applicable to memcached 1.5 and higher. To revert 
   * to modern, you must disable this parameter and re-launch, which will automatically 
   * enable slab_reassign, slab_automove, lru_crawler, lru_maintainer, and maxconns_fast.
   * 
   * Note: The default configuration value for this parameter has been changed from 0 to 1 
   * as of August 20, 2021. The updated default value will get automatically picked up by 
   * new elasticache users for each regions after August 20th, 2021. Existing ElastiCache 
   * users in the regions before August 20th, 2021 need to manually modify their custom 
   * parameter groups in order to pick up this new change.
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * @default true
   */
  readonly no_modern?: boolean;
  
  /**
   * Stores numbers from VALUE response, inside an item, using up to 24 bytes. Small slowdown 
   * for ASCII get, faster sets.
   * 
   * Modifiable: Yes, Changes Take Effect: At launch
   * 
   * @default false
   */
  readonly inline_ascii_resp?: boolean;
}

const memcachedDefaults1_5_10: Memcached1_5_10 = {
  ...memcachedDefaults1_4_33,
  inline_ascii_resp: false,
  no_modern: true
}
interface Memcached1_6_6 extends Memcached1_5_10 {

}

const memcachedDefaults1_6_6: Memcached1_6_6 = {
  ...memcachedDefaults1_5_10,
}

memcachedDefaults1_6_6
