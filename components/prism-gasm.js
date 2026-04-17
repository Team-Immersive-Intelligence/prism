Prism.languages.gasm = {
	'comment': /;.*/,
	'op-code': {
		pattern: /\b(?:add|sub|cmp|inc|dec|div|mul|jnz|jz|jns|js|mov|push|pop|call|ret|end|xor|or|shl|shr|and)\b/,
		alias: 'keyword'
	},
	'decimal-number': {
		pattern: /\b\d+\b/,
		alias: 'number'
	},
	'register': {
		pattern: /\be[abcd]x\b/i,
		alias: 'variable'
	}
};
