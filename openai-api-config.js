
module.exports = function (RED) {
	function openaiConfigNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.name = config.name;
	}

	RED.nodes.registerType("openai-api-config", openaiConfigNode,{
		credentials: {
			orgId: {type: 'password'},
			apiKey: {type: 'password'},
		}
	});
}