const OpenAI = require('openai');
const {validateData} = require("./validateData");

function prepareFileData(data) {
    let trainData = data;
    if (typeof trainData === "object") {
        let trainDataArray = [];
        for (const line of trainData) {
            trainDataArray.push(JSON.stringify(line));
        }
        trainData = trainDataArray.join('\n');
    }
    return trainData;
}

module.exports = function (RED) {
    function openaiSend(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.apiConfig = RED.nodes.getNode(config.config);

        const openaiClient = new OpenAI({
            organization: node.apiConfig.credentials.orgId,
            apiKey: node.apiConfig.credentials.apiKey
        });

        node.on('input', async function (msg, send, done) {
            node.status({
                fill: "orange",
                shape: "dot",
                text: `Trying to send...`
            });

            try {
                const payload = msg[config.payload];

                let action = Promise.resolve();
                switch (config.api) {
                    case 'chat.completions.create':
                        action = openaiClient.chat.completions.create( {
                            model: 'gpt-3.5-turbo-0613',
                            ...payload,
                        });
                        break;
                    case 'fineTuning.create': {
                        const request = {
                            model: 'gpt-3.5-turbo-0613',
                            ...payload,
                        };
                        action = openaiClient.fineTuning.jobs.create(request);
                        break;
                    }
                    case 'fineTuning.list':
                        action = openaiClient.fineTuning.jobs.list(payload.query);
                        break;
                    case 'fineTuning.retrieve':
                        action = openaiClient.fineTuning.jobs.retrieve(payload.id);
                        break;
                    case 'fineTuning.cancel':
                        action = openaiClient.fineTuning.jobs.cancel(payload.id);
                        break;
                    case 'fineTuning.listEvents':
                        action = openaiClient.fineTuning.jobs.listEvents(payload.id, payload.query);
                        break;
                    case 'files.validate': {
                        let data = prepareFileData(payload.data);
                        payload.validationLog = validateData(data);
                        action = Promise.resolve({
                            validationLog: payload.validationLog,
                        });
                        break;
                    }
                    case 'files.create': {
                        let data = prepareFileData(payload.data);
                        payload.validationLog = validateData(data);
                        action = openaiClient.files.create({
                            file: await OpenAI.toFile(Buffer.from(data, 'utf-8'), payload.name || 'input.jsonl'),
                            purpose: payload.purpose || 'fine-tune',
                        })
                        break;
                    }
                    case 'files.list':
                        action = openaiClient.files.list(payload.query);
                        break;
                    case 'files.retrieve':
                        action = openaiClient.files.retrieve(payload.id);
                        break;
                    case 'files.delete':
                        action = openaiClient.files.del(payload.id);
                        break;
                }

                const res = await action;
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `message sent`,
                });
                node.send({
                    ...msg,
                    payload: res,
                });
                if (done) {
                    done();
                }
            } catch (error) {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `error`,
                });
                if (done) {
                    // Node-RED 1.0 compatible
                    done(error);
                } else {
                    // Node-RED 0.x compatible
                    node.error(error, msg);
                }
            }
        });
    }

    RED.nodes.registerType("openai-api", openaiSend);
}
