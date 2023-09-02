
const natural = require('natural');

module.exports ={
    validateData: function validateData(data) {
        try {
            const dataset = data.split('\n').map(JSON.parse);
            let log = '';

            log += "Num examples:" + dataset.length;
            log += "\n" + "First example:";
            for (const message of dataset[0]["messages"]) {
                log += "\n" + message;
            }

            const formatErrors = {
                data_type: 0,
                missing_messages_list: 0,
                message_missing_key: 0,
                message_unrecognized_key: 0,
                unrecognized_role: 0,
                missing_content: 0,
                example_missing_assistant_message: 0,
            };

            for (const ex of dataset) {
                if (typeof ex !== 'object') {
                    formatErrors["data_type"] += 1;
                    continue;
                }

                const messages = ex.messages;
                if (!messages) {
                    formatErrors["missing_messages_list"] += 1;
                    continue;
                }

                for (const message of messages) {
                    if (!message.role || !message.content) {
                        formatErrors["message_missing_key"] += 1;
                    }

                    if (!["role", "content", "name"].includes(message.role)) {
                        formatErrors["message_unrecognized_key"] += 1;
                    }

                    if (!["system", "user", "assistant"].includes(message.role)) {
                        formatErrors["unrecognized_role"] += 1;
                    }

                    const content = message.content;
                    if (!content || typeof content !== 'string') {
                        formatErrors["missing_content"] += 1;
                    }
                }

                if (!messages.some(message => message.role === "assistant")) {
                    formatErrors["example_missing_assistant_message"] += 1;
                }
            }

            if (Object.values(formatErrors).some(value => value > 0)) {
                log += "\nFound errors:";
                for (const key in formatErrors) {
                    if (formatErrors.hasOwnProperty(key)) {
                        log += `\n${key}: ${formatErrors[key]}`;
                    }
                }
            } else {
                log += "\nNo errors found";
            }

        // Token counting functions using 'natural' library
        const tokenizer = new natural.WordTokenizer();

            function numTokensFromMessages(messages, tokensPerMessage = 3, tokensPerName = 1) {
                let numTokens = 0;
                for (const message of messages) {
                    numTokens += tokensPerMessage;
                    for (const key in message) {
                        if (message.hasOwnProperty(key)) {
                        numTokens += tokenizer.tokenize(message[key]).length;
                            if (key === "name") {
                                numTokens += tokensPerName;
                            }
                        }
                    }
                }
                numTokens += 3;
                return numTokens;
            }

            function numAssistantTokensFromMessages(messages) {
                let numTokens = 0;
                for (const message of messages) {
                    if (message.role === "assistant") {
                    numTokens += tokenizer.tokenize(message.content).length;
                    }
                }
                return numTokens;
            }

            function printDistribution(values, name) {
                log += `\n#### Distribution of ${name}:`;
                log += `min / max: ${Math.min(...values)}, ${Math.max(...values)}`;
                log += `mean / median: ${values.reduce((a, b) => a + b, 0) / values.length}, ${values[Math.floor(values.length / 2)]}`;
                log += `p5 / p95: ${values[Math.floor(values.length * 0.05)]}, ${values[Math.floor(values.length * 0.95)]}`;
            }

            let nMissingSystem = 0;
            let nMissingUser = 0;
            const nMessages = [];
            const convoLens = [];
            const assistantMessageLens = [];

            for (const ex of dataset) {
                const messages = ex.messages;
                if (!messages.some(message => message.role === "system")) {
                    nMissingSystem += 1;
                }
                if (!messages.some(message => message.role === "user")) {
                    nMissingUser += 1;
                }
                nMessages.push(messages.length);
                convoLens.push(numTokensFromMessages(messages));
                assistantMessageLens.push(numAssistantTokensFromMessages(messages));
            }

            log += "\n Num examples missing system message:" + nMissingSystem;
            log += "\n Num examples missing user message:" + nMissingUser;
            printDistribution(nMessages, "num_messages_per_example");
            printDistribution(convoLens, "num_total_tokens_per_example");
            printDistribution(assistantMessageLens, "num_assistant_tokens_per_example");
            const nTooLong = convoLens.filter(l => l > 4096).length;
            log += `\n${nTooLong} examples may be over the 4096 token limit, they will be truncated during fine-tuning`;

            const MAX_TOKENS_PER_EXAMPLE = 4096;
            const MIN_TARGET_EXAMPLES = 100;
            const MAX_TARGET_EXAMPLES = 25000;
            const TARGET_EPOCHS = 3;
            const MIN_EPOCHS = 1;
            const MAX_EPOCHS = 25;

            let nEpochs = TARGET_EPOCHS;
            const nTrainExamples = dataset.length;
            if (nTrainExamples * TARGET_EPOCHS < MIN_TARGET_EXAMPLES) {
                nEpochs = Math.min(MAX_EPOCHS, Math.floor(MIN_TARGET_EXAMPLES / nTrainExamples));
            } else if (nTrainExamples * TARGET_EPOCHS > MAX_TARGET_EXAMPLES) {
                nEpochs = Math.max(MIN_EPOCHS, Math.floor(MAX_TARGET_EXAMPLES / nTrainExamples));
            }

            const nBillingTokensInDataset = convoLens.reduce((acc, length) => acc + Math.min(MAX_TOKENS_PER_EXAMPLE, length), 0);
            log += `\nDataset has ~${nBillingTokensInDataset} tokens that will be charged for during training`;
            log += `\nBy default, you'll train for ${nEpochs} epochs on this dataset`;
            log += `\nBy default, you'll be charged for ~${nEpochs * nBillingTokensInDataset} tokens`;
            log += "\nSee pricing page to estimate total costs";
            return log;
        } catch (error) {
            throw error;
        }
    }
}