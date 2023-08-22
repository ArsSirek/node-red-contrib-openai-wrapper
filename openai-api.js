const OpenAI = require('openai');

module.exports = function(RED) {
	function openaiSend(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.apiConfig = RED.nodes.getNode(config.config);

		console.log(node.apiConfig.credentials, node.apiConfig.credentials.apiKey);
		const openaiClient = new OpenAI({
			organization: node.apiConfig.credentials.orgId,
			apiKey: node.apiConfig.credentials.apiKey
		});

		node.on('input', function (msg) {
			node.status({
				fill: "orange",
				shape: "dot",
				text: `Trying to send...`
			});

			const payload = msg[config.payload];

			const request = {
				...payload,
				model: payload.model || 'gpt-3.5-turbo-0613',
			};

			openaiClient.chat.completions.create(request)
				.then((res) => {
					node.status({
						fill: "green",
						shape: "dot",
						text: `message sent`,
					});
					node.send({
						...msg,
						payload: res,
					})
				})
				.catch((error) => {
					node.send({
						...msg,
						error: error,
					})
				});
		});
	}
	RED.nodes.registerType("openai-api", openaiSend);
}
