import { Client, MessageEmbed, TextChannel } from 'discord.js';
import FacepunchCommits from 'facepunch-commits';
import { ICommit } from 'facepunch-commits/dist/types/CommitsResponse';
import { channels } from './channels';


const client = new Client();
const commits = new FacepunchCommits();

const sendMessage = async (chatId: string, commit: ICommit) => {
	const channel = client.channels.cache.find((x) => x.id === chatId);
	if (!channel) return;

	const repNameMinimized = commit.repo.replace(/\s/g, '');
	const userNameMinimized = commit.user.name.replace(/\s/g, '');

	const embed = new MessageEmbed()
		.setTimestamp()
		.setColor('RANDOM')
		.setDescription(`\`\`\`${commit.message}\`\`\``)
		.setURL(`https://commits.facepunch.com/${commit.id}`)
		.setAuthor(commit.user.name, commit.user.avatar, `https://commits.facepunch.com/${userNameMinimized}`)
		.setFooter(`https://commits.facepunch.com/r/${repNameMinimized}/${commit.branch}`);

	(channel as TextChannel).send(embed)
		.then((message) => message.crosspost())
}

commits.subscribeToAll(async (commit) => {
	for (let i = 0; i < channels.length; i++) {
		const channel = channels[i];

		if (!channel.match) {
			await sendMessage(channel.id, commit);
		} else {
			for (let j = 0; j < channel.match.length; j++) {
				const match = channel.match[j];
				if (!commit.repo.match(match)) continue;

				await sendMessage(channel.id, commit);
			}
		}
	}
});

client.on('ready', () => {
	console.log('Started!', Date());
});

client.login(process.env.DISCORD_TOKEN)
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
