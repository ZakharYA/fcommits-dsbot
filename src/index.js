const { Client, MessageEmbed } = require('discord.js');
const _facepunchAPI = require('facepunch-commits');
const config = require('./config.json');
const Sentry = require('@sentry/node');

const client = new Client();
const facepunchAPI = new _facepunchAPI();

Sentry.init({
  dsn: config.sentryPath,
  tracesSampleRate: 1.0
});

client.on('ready', () => {
	console.log('Started!', Date());
});

const sendInChat = async(chatId, commit) => {
	const channel = await client.channels.cache.find((x) => x.id == chatId);

	const repNameMinimized = commit.repo.replace(/\s/g, '');
	const userNameMinimized = commit.user.name.replace(/\s/g, '');

	const embed = new MessageEmbed()
		.setTimestamp()
		.setColor(1740997)
		.setTitle(`Commit#${commit.changeset}`)
		.setURL(`https://commits.facepunch.com/${commit.id}`)
		.setAuthor(commit.user.name, commit.user.avatar, `https://commits.facepunch.com/${userNameMinimized}`)
		.addField('Message', '```' + (commit.isHide() ? 'Hide commit' : commit.message) + '```')
		.addField('Repository', `${commit.repo}/${commit.branch}`)
		.setFooter(`https://commits.facepunch.com/r/${repNameMinimized}/${commit.branch}`);

	const resultMessage = await channel.send(embed);
	await resultMessage.crosspost();
};

const channelsSubscribe = config.channels;

Object.keys(channelsSubscribe).map((channelId) => {
	channelsSubscribe[channelId].map((channelName) => {
		facepunchAPI.subscribeToRepository(channelName, async(commit) => {
			await sendInChat(channelId, commit);
		});
	});
});

facepunchAPI.subscribeToAll(async(commit) => {
	await sendInChat(config.channelId, commit);
});

client.login(config.token);
