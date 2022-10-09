// General purpose:
// ================

// Current generation:
// ===================

// Redis 5.0.6 and up: cache.m6g.large, cache.m6g.xlarge, cache.m6g.2xlarge, cache.m6g.4xlarge, cache.m6g.8xlarge, cache.m6g.12xlarge, cache.m6g.16xlarge (Note For region availability, see Supported node types by AWS Region.)

// M5 node types: cache.m5.large, cache.m5.xlarge, cache.m5.2xlarge, cache.m5.4xlarge, cache.m5.12xlarge, cache.m5.24xlarge

// M4 node types: cache.m4.large, cache.m4.xlarge, cache.m4.2xlarge, cache.m4.4xlarge, cache.m4.10xlarge

// Redis 5.0.6 and up: cache.t4g.micro, cache.t4g.small, cache.t4g.medium

// T3 node types: cache.t3.micro, cache.t3.small, cache.t3.medium

// T2 node types: cache.t2.micro, cache.t2.small, cache.t2.medium

// Previous generation: (not recommended. Existing clusters are still supported but creation of new clusters is not supported for these types.)
// ====================

// T1 node types: cache.t1.micro

// M1 node types: cache.m1.small, cache.m1.medium, cache.m1.large, cache.m1.xlarge

// M3 node types: cache.m3.medium, cache.m3.large, cache.m3.xlarge, cache.m3.2xlarge


// Compute optimized:
// ==================

// Previous generation: (not recommended)
// =====================
// C1 node types: cache.c1.xlarge


// Memory optimized with data tiering:
// ===================================

// Current generation:
// ===================

// Redis 6.2 and up: cache.r6gd.xlarge, cache.r6gd.2xlarge, cache.r6gd.4xlarge, cache.r6gd.8xlarge, cache.r6gd.12xlarge, cache.r6gd.16xlarge (For more information, see Data tiering.)

// Memory optimized:
// =================

// Current generation:
// ===================

// Redis 5.0.6 and up: R6g node types: cache.r6g.large, cache.r6g.xlarge, cache.r6g.2xlarge, cache.r6g.4xlarge, cache.r6g.8xlarge, cache.r6g.12xlarge, cache.r6g.16xlarge (Note For region availability, see Supported node types by AWS Region.)

// R5 node types: cache.r5.large, cache.r5.xlarge, cache.r5.2xlarge, cache.r5.4xlarge, cache.r5.12xlarge, cache.r5.24xlarge

// R4 node types: cache.r4.large, cache.r4.xlarge, cache.r4.2xlarge, cache.r4.4xlarge, cache.r4.8xlarge, cache.r4.16xlarge

// Previous generation: (not recommended)
// ======================================

// M2 node types: cache.m2.xlarge, cache.m2.2xlarge, cache.m2.4xlarge

// R3 node types: cache.r3.large, cache.r3.xlarge, cache.r3.2xlarge, cache.r3.4xlarge, cache.r3.8xlarge

/**
 * What class and generation of instance to use
 *
 * We have both symbolic and concrete enums for every type.
 *
 * The first are for people that want to specify by purpose,
 * the second one are for people who already know exactly what
 * 'R4' means.
 */
export enum NodeClass {
  /**
   * Not recommended. Only for exsiting clusters.
   * 
   * Category: General purpose
   * 
   * Generation: Previous (m1)
   * 
   * Available sizes: small, medium, large, xlarge.
   * 
   * Engine restictions: none
   */
  M1 = 'm1',

   /**
   * Not recommended
   * 
   * Category: Memory optimized
   * 
   * Generation: Previous (m2)
   * 
   * Available sizes: xlarge, 2xlarge, 4xlarge
   * 
   * Engine restictions: none
   */
  M2 = 'm2',

  /**
   * Category: General purpose
   * 
   * Generation: Previous (m3)
   * 
   * Available sizes: medium, large, xlarge, 2xlarge
   * 
   * Engine restictions: none
   */
  M3 = 'm3',

  STANDARD3 = "m3",
  /**
   * Category: General purpose
   * 
   * Generation: Current (m4)
   * 
   * Available sizes: large, xlarge, 2xlarge, 4xlarge, 10xlarge
   * 
   * Engine restictions: none
   */
  M4 = 'm4',
 
  /**
   * Category: General purpose
   * 
   * Generation: Current
   * 
   * Available sizes: large, xlarge, 2xlarge, 4xlarge, 12xlarge, 24xlarge
   * 
   * Engine restictions: none
   */
  M5 = 'm5', 

  /**
   * Not recommended
   * 
   * Category: Compute optimized
   * 
   * Generation: Previous (c1)
   * 
   * Available size: xlarge
   * 
   * Engine restictions: none
   */
  C1 = 'c1', 

  /**
   * Category: Memory optimized with data tiering
   * 
   * Generation: Current (r6gd)
   * 
   * Available sizes: xlarge, 2xlarge, 4xlarge, 8xlarge, 12xlarge, 16xlarge
   * 
   * Engine restrictions: Redis 6.2 and up
   */
  R6GD = "r6gd",

  /**
   * Category: General purpose
   * 
   * Generation: Previous (t2)
   * 
   * Available sizes: micro, small, medium
   * 
   * Engine restrictions: no AOF TODO
   */
  T2 = "t2",

  /**
   * Category: Memory optimized
   * 
   * Generation: Previous (r3)
   * 
   * Available sizes: large, xlarge, 2xlarge, 4xlarge, 8xlarge
   * 
   * Engine restrictions: none
   */
  R3 = "r3",
}

/**
 * What size of node to use
 */
export enum NodeSize {
  /**
   * Node size MICRO (micro)
   * 
   * Available for classes: T1, T2, T3, T4G
   */
  MICRO = 'micro',

  /**
   * Node size SMALL (small)
   * 
   * Available for classes: M1, T2, T3, T4G
   */
  SMALL = 'small',

  /**
   * Node size MEDIUM (medium)
   * 
   * Available in classes: M1, M3, T2, T3, T4G
   */
  MEDIUM = 'medium',

  /**
   * Node size LARGE (large)
   */
  LARGE = 'large',

  /**
   * Node size XLARGE (xlarge)
   */
  XLARGE = 'xlarge',

  /**
   * Node size XLARGE2 (2xlarge)
   */
  XLARGE2 = '2xlarge',

  /**
   * Node size XLARGE4 (4xlarge)
   */
  XLARGE4 = '4xlarge',

  /**
   * Node size XLARGE8 (8xlarge)
   */
  XLARGE8 = '8xlarge',

  /**
   * Node size XLARGE10 (10xlarge)
   */
  XLARGE10 = '10xlarge',

  /**
   * Node size XLARGE12 (12xlarge)
   */
  XLARGE12 = '12xlarge',

  /**
   * Node size XLARGE16 (16xlarge)
   */
  XLARGE16 = '16xlarge',

  /**
   * Node size XLARGE24 (24xlarge)
   */
  XLARGE24 = '24xlarge',

  // TODO make escape hatch
}

/**
 * Node type for cache clusters
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export class NodeType {
  /**
   * Node type for CacheClusters
   *
   * This class takes a combination of a class and size.
   *
   * Be aware that not all combinations of class and size are available, and not all
   * classes are available in all regions.
   */
  public static of(nodeClass: NodeClass, nodeSize: NodeSize): NodeType {
    // JSII does not allow enum types to have same value. So to support the enum, the enum with same value has to be mapped later.
    const nodeClassMap: Record<NodeClass, string> = {
      [NodeClass.C1]: 'c1',
      [NodeClass.M1]: 'm1',
      [NodeClass.M2]: 'm2',
      [NodeClass.M3]: 'm3',
      [NodeClass.M4]: 'm4',
      [NodeClass.M5]: 'm5',
      [NodeClass.R6GD]: 'r6gd',
      [NodeClass.T2]: 't2',
      [NodeClass.R3]: 'r3',
    };
    return new NodeType(`cache.${nodeClassMap[nodeClass] ?? nodeClass}.${nodeSize}`);
  }

  constructor(private readonly instanceTypeIdentifier: string) {}

  /**
   * Return the instance type as a dotted string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }

  public validate(): void {
    const parts: string[] = this.instanceTypeIdentifier.split('.');
    if (parts.length != 3) {
      throw new Error("NodeType string must contain three parts separated by a '.' in the form 'cache.class.size'");
    }
    if (parts[0] != 'cache') {
      throw new Error("The first part of the NodeType must always be 'cache");
    }
    const cls = parts[1].toUpperCase() as keyof typeof NodeClass; // <-- WARNING uppercase !!!
    const clss = NodeClass[cls];
    const reverseSizes = Object.entries(NodeSize).reduce<{[key: string]: string}>((a,c) => { a[c[1]]=c[0]; return a }, {})
    const reverseClasses = Object.entries(NodeClass).reduce<{[key: string]: string[]}>((a,c) => { if (!a[c[1]]) { a[c[1]]=[c[0]]} else { a[c[1]].push(c[0]) } return a }, {});
    const nodeClassSizeMap: Record<NodeClass, NodeSize[]> = {
      [NodeClass.C1]: [NodeSize.XLARGE],
      [NodeClass.M1]: [NodeSize.SMALL, NodeSize.MEDIUM, NodeSize.LARGE, NodeSize.XLARGE],
      [NodeClass.M2]: [NodeSize.XLARGE, NodeSize.XLARGE2, NodeSize.XLARGE4],
      [NodeClass.M3]: [NodeSize.MEDIUM, NodeSize.LARGE, NodeSize.XLARGE, NodeSize.XLARGE2],
      [NodeClass.M4]: [NodeSize.LARGE, NodeSize.XLARGE, NodeSize.XLARGE2, NodeSize.XLARGE4, NodeSize.XLARGE10],
      [NodeClass.M5]: [NodeSize.LARGE, NodeSize.XLARGE, NodeSize.XLARGE2, NodeSize.XLARGE4, NodeSize.XLARGE12, NodeSize.XLARGE24],
      [NodeClass.R6GD]: [NodeSize.XLARGE, NodeSize.XLARGE2, NodeSize.XLARGE4, NodeSize.XLARGE8, NodeSize.XLARGE12, NodeSize.XLARGE16],
      [NodeClass.T2]: [NodeSize.MICRO, NodeSize.SMALL, NodeSize.MEDIUM],
      [NodeClass.R3]: [NodeSize.LARGE, NodeSize.XLARGE, NodeSize.XLARGE2, NodeSize.XLARGE4, NodeSize.XLARGE8],
    };
    if (NodeClass[cls]) {
      if (!nodeClassSizeMap[clss].map(x => x.toString()).includes(parts[2])) {
        const spec = reverseSizes[parts[2]]
        let err = `Wrong NodeSize ${spec} for NodeClass ${cls}, this NodeClass only supports the following NodeSize(s) ${nodeClassSizeMap[clss].map(x => reverseSizes[x])}`;
        const fil = Object.entries(NodeClass).reduce<NodeClass[]>((a,c) => { if (nodeClassSizeMap[c[1]].map(x => x.toString()).includes(parts[2])) { a.push(c[1]); } return a }, [])
        const farr = fil.reduce<string[]>((a,c) => { a = [...a, ...reverseClasses[c]]; return a; }, []);
        err += `\r\nThe NodeSize ${spec} is only supported by the following NodeClass(es): ${farr}`
        err += '\r\nYou can ignore this validation by specifying disableNodeTypeValidation=true';
        throw new Error(err)
      }
    }
  }
}

// memcached1.4 | memcached1.5 | memcached1.6 | redis2.6 | redis2.8 | redis3.2 | redis4.0 | redis5.0 | redis6.x

/*
Memcached 1.4.24
Parameter group family: memcached1.4
disable_flush_all Add parameter (-F) to disable flush_all. Useful if you never want to be able to run a full flush on production instances. Default: 0 (disabled) (Modifiable, changes take effect at launch)
hash_algorithm The hash algorithm to be used. Permitted values: murmur3 and jenkins.	Default: jenkins (Modifiable, changes take effect at launch)
lru_crawler	 Cleans slab classes of items that have expired. This is a low impact process that runs in the background. Currently requires initiating a crawl using a manual command. Enabling lru_crawler at the command line enables the crawler until either disabled at the command line or the next reboot. To enable permanently, you must modify the parameter value. For more information, see Modifying a parameter group. Default  0 (disabled) (Note You can temporarily enable lru_crawler at runtime from the command line. For more information, see the Description column.)
lru_maintainer Default: 0 (disabled) A background thread that shuffles items between the LRUs as capacities are reached. Values: 0, 1.
expirezero_does_not_evict Default: 0 (disabled) When used with lru_maintainer, makes items with an expiration time of 0 unevictable. Warning: This can crowd out memory available for other evictable items. Can be set to disregard lru_maintainer.

Memcached 1.4.14
memcached1.4
config_max configMax The maximum number of ElastiCache configuration entries. Default 16 (not modifiable)
config_size_max The maximum size of the configuration entries, in bytes. Default 65536 (not modifiable)
hashpower_init The initial size of the ElastiCache hash table, expressed as a power of two. The default is 16 (2^16), or 65536 keys. Default 16 (not modifiable)
maxconns_fast Changes the way in which new connections requests are handled when the maximum connection limit is reached. If this parameter is set to 0 (zero), new connections are added to the backlog queue and will wait until other connections are closed. If the parameter is set to 1, ElastiCache sends an error to the client and immediately closes the connection. Default 0 (Modifiable, changes take effect after restart)
slab_automove Adjusts the slab automove algorithm: If this parameter is set to 0 (zero), the automove algorithm is disabled. If it is set to 1, ElastiCache takes a slow, conservative approach to automatically moving slabs. If it is set to 2, ElastiCache aggressively moves slabs whenever there is an eviction. (This mode is not recommended except for testing purposes.) Default 0 (Modifiable, changes take effect after restart)
slab_reassign Enable or disable slab reassignment. If this parameter is set to 1, you can use the "slabs reassign" command to manually reassign memory. Default 0 (Modifiable, changes take effect after restart)

Memcached 1.4.5
Parameter group family: memcached1.4

backlog_queue_limit The backlog queue limit. Default: 1024 (Not modifiable)
binding_protocol  The binding protocol. Permissible values are: ascii and auto. Default: auto (Modifiable, changes take effect after restart)
cas_disabled If 1 (true), check and set (CAS) operations will be disabled, and items stored will consume 8 fewer bytes than with CAS enabled. (Modifiable, changes take effect after restart)
chunk_size The minimum amount, in bytes, of space to allocate for the smallest item's key, value, and flags. Default: 48 (Modifiable, changes take effect after restart)
chunk_size_growth_factor The growth factor that controls the size of each successive Memcached chunk; each chunk will be chunk_size_growth_factor times larger than the previous chunk. (Modifiable, changes take effect after restart)
error_on_memory_exhausted If 1 (true), when there is no more memory to store items, Memcached will return an error rather than evicting items. Default 0  (Modifiable, changes take effect after restart)
large_memory_pages If 1 (true), ElastiCache will try to use large memory pages. Default 0 (Not modifiable)
lock_down_paged_memory If 1 (true), ElastiCache will lock down all paged memory. Default 0 (not modifiable)
max_item_size The size, in bytes, of the largest item that can be stored in the cluster. Default 1048576 (Modifiable, changes take effect after restart)
max_simultaneous_connections The maximum number of simultaneous connections. Default: 65000 (not modifiable)
maximize_core_file_limit If 1 (true), ElastiCache will maximize the core file limit. Default: 0 (Modifiable, changes take effect after restart)
memcached_connections_overhead The amount of memory to be reserved for Memcached connections and other miscellaneous overhead. Default: 100 (Modifiable, changes take effect after restart)
requests_per_event The maximum number of requests per event for a given connection. This limit is required to prevent resource starvation. Default: 20 (Not modifiable)
*/

/*
Memcached (subtract connections overhead TODO T1 micro exception default)
Node type	max_cache_memory (in megabytes)	num_threads
cache.t1.micro	213	1
cache.t2.micro	555	1
cache.t2.small	1588	1
cache.t2.medium	3301	2
cache.t3.micro	512	2
cache.t3.small	1402	2
cache.t3.medium	3364	2
cache.t4g.micro	512	2
cache.t4g.small	1402	2
cache.t4g.medium	3164	2
cache.m1.small	1301	1
cache.m1.medium	3350	1
cache.m1.large	7100	2
cache.m1.xlarge	14600	4
cache.m2.xlarge	33800	2
cache.m2.2xlarge	30412	4
cache.m2.4xlarge	68000	16
cache.m3.medium	2850	1
cache.m3.large	6200	2
cache.m3.xlarge	13600	4
cache.m3.2xlarge	28600	8
cache.m4.large	6573	2
cache.m4.xlarge	11496	4
cache.m4.2xlarge	30412	8
cache.m4.4xlarge	62234	16
cache.m4.10xlarge	158355	40
cache.m5.large	6537	2
cache.m5.xlarge	13248	4
cache.m5.2xlarge	26671	8
cache.m5.4xlarge	53516	16
cache.m5.12xlarge	160900	48
cache.m5.24xlarge	321865	96
cache.m6g.large	6537	2
cache.m6g.xlarge	13248	4
cache.m6g.2xlarge	26671	8
cache.m6g.4xlarge	53516	16
cache.m6g.8xlarge	107000	32
cache.m6g.12xlarge	160900	48
cache.m6g.16xlarge	214577	64
cache.c1.xlarge	6600	8
cache.r3.large	13800	2
cache.r3.xlarge	29100	4
cache.r3.2xlarge	59600	8
cache.r3.4xlarge	120600	16
cache.r3.8xlarge	120600	32
cache.r4.large	12590	2
cache.r4.xlarge	25652	4
cache.r4.2xlarge	51686	8
cache.r4.4xlarge	103815	16
cache.r4.8xlarge	208144	32
cache.r4.16xlarge	416776	64
cache.r5.large	13387	2
cache.r5.xlarge	26953	4
cache.r5.2xlarge	54084	8
cache.r5.4xlarge	108347	16
cache.r5.12xlarge	325400	48
cache.r5.24xlarge	650869	96
cache.r6g.large	13387	2
cache.r6g.xlarge	26953	4
cache.r6g.2xlarge	54084	8
cache.r6g.4xlarge	108347	16
cache.r6g.8xlarge	214577	32
cache.r6g.12xlarge	325400	48
cache.r6g.16xlarge	429154	64

Redis
Node type	Maxmemory	Client-output-buffer-limit-slave-hard-limit	Client-output-buffer-limit-slave-soft-limit
cache.t1.micro	142606336 (136 MB)	14260633	14260633
cache.t2.micro	581959680	(555 MB) 58195968	58195968
cache.t2.small	1665138688 (1588 MB)	166513868	166513868
cache.t2.medium	3461349376 (3301 MB)	346134937	346134937
cache.t3.micro	536870912	(512 MB) 53687091	53687091
cache.t3.small	1471026299 (~1402 MB)	147102629	147102629
cache.t3.medium	3317862236 (~3164 MB)	331786223	331786223
cache.t4g.micro	536870912	(512 MB) 53687091	53687091
cache.t4g.small	1471026299 (~1402 MB)	147102629	147102629
cache.t4g.medium	3317862236 (~3164 MB)	331786223	331786223
cache.m1.small	943718400 (900 MB)	94371840	94371840
cache.m1.medium	3093299200 (2950 MB)	309329920	309329920
cache.m1.large	7025459200 (6700 MB)	702545920	702545920
cache.m1.xlarge	14889779200 (14200 MB)	1488977920	1488977920
cache.m2.xlarge	17091788800	(16300 MB) 1709178880	1709178880
cache.m2.2xlarge	35022438400 (33400 MB)	3502243840	3502243840
cache.m2.4xlarge	70883737600	(67600 MB) 7088373760	7088373760
cache.m3.medium	2988441600	309329920	309329920
cache.m3.large	6501171200	650117120	650117120
cache.m3.xlarge	14260633600	1426063360	1426063360
cache.m3.2xlarge	29989273600	2998927360	2998927360
cache.m4.large	6892593152	689259315	689259315
cache.m4.xlarge	11496376320	1149637632	1149637632
cache.m4.2xlarge	31889126359	3188912636	3188912636
cache.m4.4xlarge	65257290629	6525729063	6525729063
cache.m4.10xlarge	166047614239	16604761424	16604761424
cache.m5.large	6854542746	685454275	685454275
cache.m5.xlarge	13891921715	1389192172	1389192172
cache.m5.2xlarge	27966669210	2796666921	2796666921
cache.m5.4xlarge	56116178125	5611617812	5611617812
cache.m5.12xlarge	168715971994	16871597199	16871597199
cache.m5.24xlarge	337500562842	33750056284	33750056284
cache.m6g.large	6854542746	685454275	685454275
cache.m6g.xlarge	13891921715	1389192172	1389192172
cache.m6g.2xlarge	27966669210	2796666921	2796666921
cache.m6g.4xlarge	56116178125	5611617812	5611617812
cache.m6g.8xlarge	111325552312	11132555231	11132555231
cache.m6g.12xlarge	168715971994	16871597199	16871597199
cache.m6g.16xlarge	225000375228	22500037523	22500037523
cache.c1.xlarge	6501171200	650117120	650117120
cache.r3.large	14470348800	1468006400	1468006400
cache.r3.xlarge	30513561600	3040870400	3040870400
cache.r3.2xlarge	62495129600	6081740800	6081740800
cache.r3.4xlarge	126458265600	12268339200	12268339200
cache.r3.8xlarge	254384537600	24536678400	24536678400
cache.r4.large	13201781556	1320178155	1320178155
cache.r4.xlarge	26898228839	2689822883	2689822883
cache.r4.2xlarge	54197537997	5419753799	5419753799
cache.r4.4xlarge	108858546586	10885854658	10885854658
cache.r4.8xlarge	218255432090	21825543209	21825543209
cache.r4.16xlarge	437021573120	43702157312	43702157312
cache.r5.large	(~13 GB) 14037181030	1403718103	1403718103
cache.r5.xlarge	(~26 GB) 28261849702	2826184970	2826184970
cache.r5.2xlarge (~52 GB)	56711183565	5671118356	5671118356
cache.r5.4xlarge (~105 GB) 113609865216	11360986522	11360986522
cache.r5.12xlarge	(~ 317 GB) 341206346547	34120634655	34120634655
cache.r5.24xlarge	(~635 GB) 682485973811	68248597381	68248597381
cache.r6g.large	14037181030	1403718103	1403718103
cache.r6g.xlarge	28261849702	2826184970	2826184970
cache.r6g.2xlarge	56711183565	5671118356	5671118356
cache.r6g.4xlarge	113609865216	11360986522	11360986522
cache.r6g.8xlarge	225000375228	22500037523	22500037523
cache.r6g.12xlarge	341206346547	34120634655	34120634655
cache.r6g.16xlarge	450000750456	45000075046	45000075046
cache.r6gd.xlarge	28261849702	2826184970	2826184970
cache.r6gd.2xlarge	56711183565	5671118356	5671118356
cache.r6gd.4xlarge	113609865216	11360986522	11360986522
cache.r6gd.8xlarge	225000375228	22500037523	22500037523
cache.r6gd.12xlarge	341206346547	34120634655	34120634655
cache.r6gd.16xlarge	450000750456	45000075046	45000075046
*/
