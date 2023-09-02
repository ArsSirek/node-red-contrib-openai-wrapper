# Node-RED OpenAI API Wrapper

This Node-RED module extends the capabilities of Node-RED by adding nodes that facilitate interactions with the OpenAI API using the official OpenAI npm package. It allows you to seamlessly integrate OpenAI's GPT-3 models into your Node-RED flows.

## Supported API Calls

### 1. [chat.completions.create](https://platform.openai.com/docs/api-reference/chat/create)

This node allows you to create chat completions using OpenAI's chat models.

### 2. [fineTuning.create](https://platform.openai.com/docs/api-reference/fine-tuning/create)

This node is used for fine-tuning tasks and expects the following optional parameters:

- `msg.payload.validationData`: A string containing the content of the validation file.
- `msg.payload.model`: Optional model configuration.
- `msg.payload.hyperparameters`: Optional hyperparameter configuration.

### 3. [fineTuning.list](https://platform.openai.com/docs/api-reference/fine-tuning/undefined)

This node lists fine-tuning jobs with no required parameters.

### 4. [fineTuning.retrieve](https://platform.openai.com/docs/api-reference/fine-tuning/retrieve)

This node retrieves fine-tuning job details based on the provided `payload.id` (fine-tuning job ID). You can also include an optional `payload.query` parameter to specify query details like `after` and `limit`.

### 5. [fineTuning.cancel](https://platform.openai.com/docs/api-reference/fine-tuning/cancel)

This node cancels a fine-tuning job using the provided `payload.id` (fine-tuning job ID).

### 6. [fineTuning.listEvents](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)

This node lists events related to a fine-tuning job based on the provided `payload.id` (fine-tuning job ID). You can include an optional `payload.query` parameter to specify query details like `after` and `limit`.

### 7. files.validate

This node validates fine-tune data and attempts to predict the cost. It helps ensure your data is suitable for fine-tuning.

### 8. [files.create](https://platform.openai.com/docs/api-reference/files/create)

This node creates files for fine-tuning and expects the following input:

- `msg.payload.data`: A string with training data in JSONL format or an array of JSON objects with a `messages` field containing training conversations.

For example:
```json
[
  {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]},
  {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]},
  {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
]
```
Additionally, you can set the following parameters:
- `msg.payload.name: File name.`
- `msg.payload.purpose: File purpose.`

### 9. [files.list](https://platform.openai.com/docs/api-reference/files/list)

This node lists files available for fine-tuning.

### 10. [files.retrieve](https://platform.openai.com/docs/api-reference/files/retrieve)

This node retrieves file details based on the provided `payload.id` (file ID).

### 11. [files.retrieveContents](https://platform.openai.com/docs/api-reference/files/retrieve-contents)

This node retrieves the contents of a file based on the provided `payload.id` (file ID).

### 12. [files.delete](https://platform.openai.com/docs/api-reference/files/delete)

This node deletes a file based on the provided `payload.id` (file ID).


## Troubleshooting

If you encounter any issues or have questions, please visit the [GitHub repository](https://github.com/ArsSirek/node-red-contrib-openai-wrapper/issues) for support and reporting problems.


For more detailed information import the examples from the node

---

This README provides an overview of the Node-RED OpenAI API Wrapper and instructions for usage and troubleshooting. You can further customize it to include specific details or usage examples relevant to your project.
