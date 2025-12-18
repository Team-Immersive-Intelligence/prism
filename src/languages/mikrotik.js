/** @type {import('../types.d.ts').LanguageProto<'mikrotik'>} */
export default {
	id: 'mikrotik',
	optional: 'regex',
	alias: ['routeros', 'ros'],
	grammar () {
		// Based on https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting
		// and https://github.com/devMikeUA/vscode_mikrotik_routeros_script

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Globalcommands
		const GLOBAL_COMMANDS = [
			'beep',
			'convert',
			'delay',
			'deserialize',
			'environment',
			'error',
			'execute',
			'find',
			'global',
			'grep',
			'jobname',
			'len',
			'local',
			'log',
			'nothing',
			'onerror',
			'parse',
			'pick',
			'put',
			'range',
			'resolve',
			'retry',
			'rndnum',
			'rndstr',
			'serialize',
			'set',
			'time',
			'timestamp',
			'toarray',
			'tobool',
			'tocrlf',
			'toid',
			'toip',
			'toip6',
			'tolf',
			'tonsec',
			'tonum',
			'tostr',
			'totime',
			'typeof',
		];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Menuspecificcommands
		const MENU_SPECIFIC_COMMANDS = [
			'add',
			'disable',
			'edit',
			'enable',
			'export',
			'find',
			'get',
			'import',
			'monitor-traffic',
			'print',
			'quit',
			'redo',
			'remove',
			'send',
			'set',
			'undo',
		];

		// https://help.mikrotik.com/docs/display/ROS/Command+Line+Interface
		const MENU_PATHS = [
			// IP menu submenus
			'address',
			'address-list',
			'arp',
			'dhcp-client',
			'dhcp-server',
			'dns',
			'firewall',
			'filter',
			'hotspot',
			'ipsec',
			'mangle',
			'nat',
			'neighbor',
			'pool',
			'route',
			'service',
			'settings',
			'traffic-flow',
			// Interface menu submenus
			'ethernet',
			'wireless',
			'bridge',
			'vlan',
			'bonding',
			'lte',
			'pppoe-client',
			'l2tp-client',
			'ovpn-client',
			'gre',
			'eoip',
			'ipip',
			'list',
			// System menu submenus
			'identity',
			'logging',
			'ntp',
			'client',
			'scheduler',
			'script',
			'resource',
			'package',
			'reboot',
			'shutdown',
			// Routing menu submenus
			'bgp',
			'ospf',
			'rip',
			'mpls',
			'vrrp',
			// PPP menu submenus
			'profile',
			'secret',
			'active',
			'aaa',
			// Other common menus
			'radius',
			'routing',
			'snmp',
			'special-login',
			'store',
			'system',
			'tool',
			'e-mail',
			'torch',
			'sniffer',
			'bandwidth-test',
			'netwatch',
			'ping',
			'traceroute',
			'user',
			'certificate',
			'driver',
			'file',
			'queue',
			'simple',
			'tree',
			'type',
			'port',
			'log',
			'ipv6',
		];

		// Common properties used across many menus
		const COMMON_PROPERTIES = ['disabled', 'comment', 'name'];

		// Common property names (e.g., `contents` in `/file get ... contents`, `running` in `/interface get ether1 running`)
		// Note: `comment`, `disabled`, and `name` are excluded as they're already in COMMON_PROPERTIES
		// https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface
		const PROPERTIES = [
			'last-modified',
			'target-scope',
			'target-address',
			'total-bytes',
			'primary-ntp',
			'secondary-ntp',
			'free-memory',
			'mac-address',
			'cpu-load',
			'actual-mtu',
			'default-name',
			'contents',
			'distance',
			'gateway',
			'message',
			'running',
			'pref-src',
			'rx-packet',
			'tx-packet',
			'rx-error',
			'tx-error',
			'rx-drop',
			'tx-drop',
			'rx-byte',
			'tx-byte',
			'interfaces',
			'l2mtu',
			'scope',
			'status',
			'topics',
			'bytes',
			'size',
			'time',
			'type',
			'action',
			'mtu',
			'uptime',
			'packets',
			'include',
			'exclude',
		];

		// Common property values (enum-like values used in parameter assignments)
		// https://help.mikrotik.com/docs/spaces/ROS/pages/328134/Command+Line+Interface
		const PROPERTY_VALUES = [
			'auto',
			'debug',
			'disabled',
			'dynamic',
			'enabled',
			'error',
			'firewall',
			'info',
			'none',
			'no',
			'pppoe',
			'static',
			'system',
			'warning',
			'yes',
			// Firewall actions
			'accept',
			'drop',
			'reject',
			'redirect',
			'masquerade',
			'src-nat',
			'dst-nat',
			// Firewall chains
			'input',
			'output',
			'forward',
			'srcnat',
			'dstnat',
			'prerouting',
			'postrouting',
			// Protocols
			'tcp',
			'udp',
			'icmp',
			// Connection states
			'new',
			'established',
			'related',
			'invalid',
			// Interface status
			'up',
			'down',
			'unknown',
			'dormant',
			'notpresent',
			'lowerlayerdown',
			// DHCP/lease status
			'bound',
			'waiting',
			'offered',
			'expired',
			// General status
			'active',
			'inactive',
			// Policy values (for scheduler and user permissions)
			'read',
			'write',
			'test',
			'sniff',
			'policy',
			'ftp',
			'reboot',
			'password',
			'sensitive',
			'romon',
		];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-printparameters
		const PRINT_PARAMETERS = [
			'append',
			'as-string',
			'as-value',
			'brief',
			'detail',
			'count-only',
			'file',
			'follow',
			'follow-only',
			'from',
			'interval',
			'terse',
			'value-list',
			'without-paging',
			'where',
			'about',
		];

		// https://help.mikrotik.com/docs/display/ROS/Command+Line+Interface
		const ADD_COMMAND_PARAMETERS = ['copy-from', 'place-before'];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/250708064/Common%20Firewall%20Matchers%20and%20Actions
		const FIREWALL_PARAMETERS = [
			'action',
			'chain',
			'src-address',
			'dst-address',
			'src-address-list',
			'dst-address-list',
			'src-port',
			'dst-port',
			'protocol',
			'connection-state',
			'connection-mark',
			'new-connection-mark',
			'new-packet-mark',
			'in-interface',
			'out-interface',
			'log',
			'log-prefix',
		];

		// https://help.mikrotik.com/docs/display/ROS/Command+Line+Interface
		const NETWORK_PARAMETERS = [
			'address',
			'interface',
			'gateway',
			'routing-mark',
			'new-routing-mark',
			'passthrough',
			'local-address',
			'remote-address',
			'remote-port',
			'to-ports',
			'port',
			'ports',
		];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/8323191/Ethernet
		const INTERFACE_PARAMETERS = ['mtu', 'l2mtu', 'mac-address'];

		// DHCP-related parameters
		// https://help.mikrotik.com/docs/display/ROS/DHCP
		const DHCP_PARAMETERS = [
			'dhcp-option',
			'dhcp-options',
			'address-pool',
			'dns-server',
			'dns-interface',
			'dns-name',
		];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/130220087/Connection%2Btracking
		const TIMEOUT_PARAMETERS = [
			'connection-idle-timeout',
			'idle-timeout',
			'keepalive-timeout',
			'icmp-timeout',
			'tcp-timeout',
			'tcp-established-timeout',
			'tcp-fin-wait-timeout',
			'tcp-close-wait-timeout',
			'tcp-last-ack-timeout',
			'tcp-time-wait-timeout',
			'tcp-close-timeout',
			'tcp-syn-sent-timeout',
			'tcp-syn-received-timeout',
		];

		// Queue-related parameters
		// https://help.mikrotik.com/docs/spaces/ROS/pages/328088/Queues
		const QUEUE_PARAMETERS = [
			'parent',
			'priority',
			'limit-at',
			'max-limit',
			'queue',
			'target',
			'dst',
		];

		// NTP-related parameters
		// https://help.mikrotik.com/docs/spaces/ROS/pages/40992869/NTP
		const NTP_PARAMETERS = ['primary-ntp', 'secondary-ntp'];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/132350049/PPP%2BAAA
		const SERVICE_PARAMETERS = ['default-profile', 'default-group', 'default-route-distance'];

		// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Datatypes
		const DATA_TYPES = {
			'internal-id': {
				pattern: /(?<=\s)\*([1-9a-f][\da-f]*|0)\b/i,
				alias: 'constant',
			},
			'ip-address': [
				{
					pattern: /\b\d{1,3}(?:\.\d{1,3}){3}\/(?:[0-2]?\d|3[0-2])\b/,
					alias: ['ip-prefix', 'constant'],
				},
				{
					pattern: /\b\d{1,3}(?:\.\d{1,3}){3}\b/,
					alias: 'constant',
				},
			],
			'ip6-address': [
				{
					pattern:
						/(?<!\w)(?:(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?)\/(?:1[01]\d|12[0-8]|\d{1,2})\b/i,
					alias: ['ip6-prefix', 'constant'],
				},
				{
					pattern:
						/(?<!\w)(?:(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?)\b/i,
					alias: 'constant',
				},
			],
			'date-time': {
				// Combined date-time format: mmm/DD/YYYY HH:MM:SS (e.g., may/13/1982 16:30:15)
				// https://help.mikrotik.com/docs/spaces/ROS/pages/40992866/Clock
				pattern:
					/\b(?:apr|aug|dec|feb|jan|jul|jun|mar|may|nov|oct|sep)\/\d{1,2}\/\d{4} \d+:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?\b/i,
				alias: 'constant',
			},
			'date': {
				// Date format: mmm/DD/YYYY (e.g., may/13/1982)
				// https://help.mikrotik.com/docs/spaces/ROS/pages/40992866/Clock
				pattern: /\b(?:apr|aug|dec|feb|jan|jul|jun|mar|may|nov|oct|sep)\/\d{1,2}\/\d{4}\b/i,
				alias: 'constant',
			},
			'time': [
				{
					// HH:MM:SS or HH:MM:SS.ms format (e.g., 16:30:15, 0:45, 0:3:2.05)
					// https://help.mikrotik.com/docs/spaces/ROS/pages/40992866/Clock
					pattern: /\b\d+:\d{1,2}(?::\d{1,2}(?:\.\d+)?)?\b/,
					alias: 'constant',
				},
				{
					// Numeric values with unit suffixes (e.g., 1d, 2h30m, 45s, 500ms, 1w)
					// Supports: s (seconds), m (minutes), h (hours), d (days), w (weeks), ms (milliseconds)
					pattern: /\b\d+(?:[dhmsw]|ms)(?:\s*\d+(?:[dhmsw]|ms))*\b/i,
					alias: ['with-units', 'constant'],
				},
			],
			// Number pattern: matches positive numbers only (hexadecimal: 0-9, a-f)
			// The minus sign (-) is handled by the arithmetic-operator pattern
			// This allows proper distinction between binary (var -1) and unary (-1) minus
			'number': /\b(?:[1-9a-f][\da-f]*|0)\b/i,

			'boolean': /\b(?:false|true)\b/,
		};

		// Common variable patterns for `$`-based variable references
		const VARIABLE_PATTERNS = [
			{
				// Quoted variable after `$`: `$"var-name"`
				// Use (?:[^"\\]|\\.)* instead of [^"\\]*(?:\\.[^"\\]*)* to avoid exponential backtracking
				pattern: /(?<=\$)"(?:[^"\\]|\\.)*"/,
				greedy: true,
			},
			{
				// Unquoted variable after `$`: `$varName`
				pattern: /(?<=\$)[a-z\d]+/i,
				greedy: true,
			},
		];

		// ============== Helper functions ==============

		/**
		 * @param {string} alias
		 * @param {string|string[]|undefined} to
		 * @returns {string|string[]}
		 */
		function addAlias (alias, to) {
			if (!to) {
				return alias;
			}

			return Array.isArray(to) ? [alias, ...to] : [alias, to];
		}

		/**
		 * Converts DATA_TYPES entries into pattern objects with aliases.
		 *
		 * @param {string[]} [excludeKeys] Keys to exclude from the result
		 * @returns {Array}
		 */
		function getDataTypesPatterns (excludeKeys = []) {
			return Object.entries(DATA_TYPES)
				.filter(([key]) => !excludeKeys.includes(key))
				.map(([key, value]) => {
					if (value instanceof RegExp) {
						return {
							pattern: value,
							alias: key,
						};
					}

					if (Array.isArray(value)) {
						return value.map(v => ({
							...v,
							alias: addAlias(key, v.alias),
						}));
					}

					return {
						...value,
						alias: addAlias(key, value.alias),
					};
				})
				.flat();
		}

		/**
		 * Builds a token pattern from an array of keywords and assigns an alias to it.
		 *
		 * @param {string[]} keywords Array of keywords
		 * @param {string|string[]} alias Alias to assign to every keyword in the pattern
		 * @returns {{pattern: RegExp, alias: string|string[]}}
		 */
		function getKeywordPattern (keywords, alias) {
			return {
				pattern: new RegExp(`(?<=\\s)(?:${keywords.join('|')})(?==)`),
				alias,
			};
		}

		/**
		 * Builds a regex pattern that matches nested structures with a limited depth.
		 * We use it to match balanced delimiters, such as parentheses, brackets, or custom tokens (e.g., `$[...]` and `$(...)`).
		 *
		 * @param {string} openToken e.g. `$(` or `(` or `[`
		 * @param {string} closeToken e.g. `)` or `]`
		 * @param {object} options
		 * @param {number} [options.depth=3] maximum nesting depth
		 * @param {string} [options.flags=''] regex flags
		 * @param {boolean} [options.captureInner=false] whether to capture the open/close tokens or use lookarounds to get inner content only
		 * @returns {RegExp}
		 */
		function buildNestedRegex (
			openToken,
			closeToken,
			{ depth = 3, flags = '', captureInner = false } = {}
		) {
			// Escape characters for regex patterns
			const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			// last char of openToken is the nesting char; prefix is anything before it (e.g. '$' from '$(')
			let [prefix, openerChar] = openToken;
			if (!openerChar) {
				// openToken is a single character string; prefix is empty
				prefix = '';
			}
			else {
				// openToken is a string with a prefix and a single character; remove the prefix from openToken
				openToken = openerChar;
			}

			prefix = escape(prefix);
			openToken = escape(openToken);
			closeToken = escape(closeToken);

			// Single non-special char (or escaped char, or line continuation)
			// Line continuation: backslash followed by optional \r and required \n
			const atom = `[^${openToken}${closeToken}\\\\]|${/\\./.source}|\\\\\\r?\\n`;

			// Build depth-limited pattern recursively:
			// content_0 = (?:atom)+
			// content_k = (?: (?:atom)+ | opener content_{k-1} closer )+
			let prev = `(?:${atom})+`; // content_0
			for (let level = 1; level <= depth; level++) {
				// Each unit is either atoms or a nested pair; require one or more units
				prev = `(?:(?:(?:${atom})+|(?:${openToken}${prev}${closeToken})))+`;
			}

			return new RegExp(
				captureInner
					? `(?<=${prefix}${openToken})${prev}(?=${closeToken})`
					: `${prefix}${openToken}${prev}${closeToken}`,
				flags
			);
		}

		// ============== End of helper functions ==============

		return {
			'comment': {
				pattern: /(?<=^|\s)#.*$/m,
				greedy: true,
			},

			// Note: Only arrays defined in one line are supported; they should always end with `;`!
			// Arrays appear in assignments or function calls, not as standalone scopes
			'array': {
				// Match `{ ... }` that is NOT after `do=`, `else=`, and appears in array contexts
				// Arrays are typically: :local arr {1;2;3}, :put {1;2;3}, or {1;2;3},5
				// Scopes are: `do={...}`, `else={...}`, or standalone blocks
				// Exclude `do={` and `else={` by checking that we're not immediately after `do=` or `else=`
				pattern: /(?<!do=)(?<!else=)\{[^{}\r\n]*\}(?=\s*[;=,)]|\s*$)/,
				greedy: true,
				inside: {
					'punctuation': [
						{
							pattern: /^\{/,
							alias: 'begin-of-array',
						},
						{
							pattern: /\}$/,
							alias: 'end-of-array',
						},
					],
					'array-item': [
						{
							// Array items with keys: "key"=value or key=value
							pattern: /(?<=\s|^)([^;=]+=[^;]+)(?=;|$)/,
							inside: {
								'key': {
									pattern: /(?:"[^"]+"|[^\s=][^=]*)(?==)/,
									inside: {
										'punctuation': /^"|"$/,
									},
								},
								'value': [
									...getDataTypesPatterns(),
									// Fallback for values with unknown data type
									/(?<==)[^;]+/,
								],
								'operator': /=/,
							},
						},
						// Array items without keys: number, boolean, etc.
						...getDataTypesPatterns().map(v => {
							let source = v.pattern.source.replace(/^\^/, '');
							source = source.replace(/\(\?<=\\s\|=\|\^\)/, '(?<=\\s|=|^|\\{|;)');

							return {
								...v,
								// Add array item boundary: ensure it ends with ; or it's the last item in the array
								pattern: new RegExp(`${source}(?=;|$)`, v.pattern.flags),
							};
						}),
						// TODO: Support strings

						// Fallback for values without keys and unknown data type
						/(?<=[\s{};]|^)([^;=]+)(?=;|$)/,
					],
					'array-item-delimiter': {
						pattern: /;/,
						alias: 'punctuation',
					},
				},
			},

			'regex': {
				pattern: /~\s*"((?:\\.|[^"\\])*)"/,
				greedy: true,
				inside: {
					'operator': {
						pattern: /^~/,
						alias: 'regex-operator',
					},
					'punctuation': /^"|"$/,
					$rest: 'regex',
				},
			},

			// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Variables
			'variable': [
				// Definition
				{
					// Quoted variable after `:(global|local|set)`: `"var-name"`
					// Use (?:[^"\\]|\\.)* instead of [^"\\]*(?:\\.[^"\\]*)* to avoid exponential backtracking
					pattern: /(?<=:(?:global|local|set)\s+)("(?:[^"\\]|\\.)*")/,
					greedy: true,
				},
				{
					// Unquoted variable after `:(global|local|set)`: `varName`
					pattern: /(?<=:(?:global|local|set)\s+)[A-Za-z\d]+/,
					greedy: true,
				},

				// Reference
				...VARIABLE_PATTERNS,
			],

			'subexpression': {
				// Depth 3 nested parentheses
				pattern: buildNestedRegex('(', ')', {
					captureInner: true,
				}),
				greedy: true,
				inside: 'mikrotik',
			},

			'command-substitution': {
				// Depth 3 nested square brackets
				pattern: buildNestedRegex('[', ']', {
					captureInner: true,
				}),
				greedy: true,
				alias: 'command-concatenation',
				inside: 'mikrotik',
			},

			'string': {
				pattern:
					/(?<!\$\s?)(?<!\b:(?:global|local|set)\s)(")(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
				greedy: true,
				inside: {
					// Expressions inside strings: `$[...]` and  `$(...)`
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ConcatenationOperators
					'expression': {
						pattern: new RegExp(
							buildNestedRegex('$(', ')').source +
								'|' +
								buildNestedRegex('$[', ']').source
						),
						inside: {
							'begin-of-expression': {
								pattern: /^\$[[(]/,
								alias: 'punctuation',
							},
							'end-of-expression': {
								pattern: /[\])]$/,
								alias: 'punctuation',
							},
							$rest: 'mikrotik',
						},
					},
					'variable': VARIABLE_PATTERNS,
					'substitution-operator': {
						pattern: /\$$/,
						alias: 'operator',
					},
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ConstantEscapeSequences
					'escape-sequence': {
						pattern: /\\(["\\nrt$_abfv]|[0-9A-F]{2})/,
						alias: 'char',
					},
				},
			},

			'keyword': [
				// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Whitespacebetweentokens
				/\b(from|in|on-error|step|to)(?==)/,
				{
					// `else` could be part of the previous pattern, but we need to assign it a different alias;
					// and since it must follow by `=`, we can't make it part of the general keywords pattern below
					pattern: /\belse(?==)/,
					alias: 'control-flow',
				},
				{
					// Loops and conditional statements (https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Loopsandconditionalstatements)
					pattern: /\b(do|for|foreach|if|while)(?=[\s{=[(])/,
					alias: 'control-flow',
				},
				{
					// `once` keyword for monitoring commands (e.g., `/interface monitor-traffic ether1 once`)
					pattern: /\bonce\b/,
				},
			],

			'parameter': [
				getKeywordPattern(PRINT_PARAMETERS, ['print-parameter', 'property']),
				// Print parameters without = (e.g., `where`, `brief`, `detail`)
				{
					pattern: new RegExp(`(?<=\\s)(?:${PRINT_PARAMETERS.join('|')})(?!\\s*=)`),
					alias: ['print-parameter', 'property'],
				},
				getKeywordPattern(ADD_COMMAND_PARAMETERS, ['add-parameter', 'property']),
				getKeywordPattern(COMMON_PROPERTIES, ['common-property', 'property']),
				getKeywordPattern(FIREWALL_PARAMETERS, ['firewall-parameter', 'property']),
				getKeywordPattern(NETWORK_PARAMETERS, ['network-parameter', 'property']),
				getKeywordPattern(INTERFACE_PARAMETERS, ['interface-parameter', 'property']),
				getKeywordPattern(DHCP_PARAMETERS, ['dhcp-parameter', 'property']),
				getKeywordPattern(TIMEOUT_PARAMETERS, ['timeout-parameter', 'property']),
				getKeywordPattern(QUEUE_PARAMETERS, ['queue-parameter', 'property']),
				getKeywordPattern(NTP_PARAMETERS, ['ntp-parameter', 'property']),
				getKeywordPattern(SERVICE_PARAMETERS, ['service-parameter', 'property']),
				{
					// Fallback: match any parameter-like pattern
					pattern: /(?<=\s)[\w-]+(?==)/,
					alias: 'property',
				},
			],

			'command': [
				{
					// Known menu/submenu paths (more specific, should come before generic pattern)
					// Matches after `/` or after whitespace (for submenu paths like `/ppp secret`)
					pattern: new RegExp('(?<=\\/|\\s)(?:' + MENU_PATHS.join('|') + ')\\b'),
					alias: ['menu-path', 'function'],
				},
				{
					// Generic menu path pattern (catches any other menu paths)
					// Only matches after `/` to avoid false positives with parameters
					pattern: /(?<=\/)[a-z]\w*/,
					alias: ['path', 'function'],
				},
				{
					pattern: new RegExp('(?<=:)(?:' + GLOBAL_COMMANDS.join('|') + ')\\b'),
					alias: ['global-command', 'builtin'],
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Functions
					pattern: /(?<=:)return\b/,
					alias: ['function-return', 'builtin'],
				},
				{
					pattern: new RegExp('\\b(?:' + MENU_SPECIFIC_COMMANDS.join('|') + ')\\b'),
					alias: ['menu-specific-command', 'common-command', 'function'],
				},
			],

			'prefix': {
				pattern: /[:/]$/,
				alias: 'punctuation',
			},

			'end-of-command': {
				pattern: /;(?=\s|$)/,
				alias: 'punctuation',
			},

			'property': {
				// Property names (e.g., `contents` in `/file get ... contents`, `running` in `/interface get ether1 running`)
				// Matches property names anywhere (not followed by `=`)
				// Includes both PROPERTIES and COMMON_PROPERTIES
				pattern: new RegExp(
					'\\b(?:' +
						// eslint-disable-next-line regexp/sort-alternatives
						PROPERTIES.join('|') +
						'|' +
						COMMON_PROPERTIES.join('|') +
						')(?!\\s*=)'
				),
			},

			'property-value': {
				// Common property values (e.g., `pppoe` in `buffer=pppoe`, `yes` in `disabled=yes`)
				// Matches known enum-like values when they appear after `=` or after comma in lists
				// Ensures complete values: not part of filenames (no dot/slash after) or other complex values
				// Supports comma-separated lists (e.g., `policy=read,write,test`)
				pattern: new RegExp(
					// eslint-disable-next-line regexp/sort-alternatives
					'(?<=,|=)\\s*(?:' + PROPERTY_VALUES.join('|') + ')(?=$|[^./\\w-])'
				),
				alias: 'attr-value',
			},

			...DATA_TYPES,

			'operator': [
				{
					pattern: /->/,
					alias: 'access-array-element-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ArithmeticOperators
					// Note: `-` can be both unary (e.g., `-42`) and binary (e.g., `$var - 1`)
					pattern: /[%*/+-]/,
					alias: 'arithmetic-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-LogicalOperators
					pattern: /!|&&|\|\||\b(and|in|or)\b/,
					alias: 'logical-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-BitwiseOperators
					pattern: /<<|>>|[~|^&]/,
					alias: 'bitwise-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-RelationalOperators
					pattern: /[<>]=?|!=/,
					alias: 'relational-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-ConcatenationOperators
					// Matches dots and commas used for concatenation, avoiding false positives in filenames (e.g., `file.txt`)
					// Matches when NOT between two word characters (excludes `file.txt`) OR when adjacent to quotes/brackets/operators
					pattern: /\B[.,]\B|(?<=[")\]}$])[.,]|[.,](?=["[({$])/,
					alias: 'concatenation-operator',
				},
				{
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-OtherOperators
					// Matches parentheses used for grouping (e.g., `(4+5)`)
					// Note: `subexpression` uses `captureInner: true`, so parentheses are still available here
					pattern: /[()]/,
					alias: 'grouping-operator',
				},
				{
					// Substitution operator: matches $ followed by a variable
					// Examples: $"my-var", $myVar, $varName
					// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-OtherOperators
					pattern: /\$$/,
					alias: 'substitution-operator',
				},
				/=/,
			],

			'line-joining': {
				// https://help.mikrotik.com/docs/spaces/ROS/pages/47579229/Scripting#Scripting-Linejoining
				pattern: /\\(?=\r?\n|$)/m,
				alias: 'punctuation',
			},

			'begin-of-scope': {
				pattern: /\{/,
				alias: 'punctuation',
			},

			'end-of-scope': {
				pattern: /\}/,
				alias: 'punctuation',
			},

			'punctuation': /[[\]"]/,
		};
	},
};
