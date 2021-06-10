export interface IChannels {
	id: string,
	match?: string[] | RegExp[]
}

export const channels: IChannels[] = [
	{
		id: '754369898024534016'
	},
	{
		id: '760145201653088266',
		match: [/sbox|sandbox/g]
	},
	{
		id: '760145269702000661',
		match: ['rust_reboot', 'rust_art']
	}
];
