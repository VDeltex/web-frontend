export const TokenGiver = {
	"ABI version": 2,
	version: "2.2",
	header: [
	  "time"
	],
	functions: [
	  {
		name: "constructor",
		inputs: [
		  {
			name: "_tokens",
			type: "address[]"
		  }
		],
		outputs: []
	  },
	  {
		name: "getTokens",
		inputs: [],
		outputs: []
	  },
	  {
		name: "tokens",
		inputs: [],
		outputs: [
		  {
			name: "tokens",
			type: "address[]"
		  }
		]
	  }
	],
	data: [
	  {
		key: 1,
		name: "_nonce",
		type: "uint256"
	  }
	],
	events: [],
	fields: [
	  {
		name: "_pubkey",
		type: "uint256"
	  },
	  {
		name: "_timestamp",
		type: "uint64"
	  },
	  {
		name: "_constructorFlag",
		type: "bool"
	  },
	  {
		name: "_nonce",
		type: "uint256"
	  },
	  {
		name: "tokens",
		type: "address[]"
	  }
	]
  } as const