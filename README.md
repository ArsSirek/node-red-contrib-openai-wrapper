adds Node to call openai api via openai npm package


supported api calls

- [chat.completions.create](https://platform.openai.com/docs/api-reference/chat/create)

- [fineTuning.create](https://platform.openai.com/docs/api-reference/fine-tuning/create)
additionally expects
  optional msg.payload.validationData - string of the validation file content

  optional msg.payload.model

  optional msg.payload.hyperparameters


- [fineTuning.list](https://platform.openai.com/docs/api-reference/fine-tuning/undefined)
no params
- [fineTuning.retrieve](https://platform.openai.com/docs/api-reference/fine-tuning/retrieve)
payload.id should be fineTune job id
optional payload.query {after, limit}
- [fineTuning.cancel](https://platform.openai.com/docs/api-reference/fine-tuning/cancel)
payload.id should be fineTune job id
- [fineTuning.listEvents](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)
payload.id should be fineTune job id
optional payload.query {after, limit}

- files.validate 
validates fine-tune data and tries to predict the cost

- files.create https://platform.openai.com/docs/api-reference/files/create
 msg.payload.data to be string with training data JSONL or array of json objects with messages field containing 1 training conversations
```json lines
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
```
or equivalent js array of objects
msg.payload.name - file name
msg.payload.purpose

- files.list https://platform.openai.com/docs/api-reference/files/list
- files.retrieve https://platform.openai.com/docs/api-reference/files/retrieve
- files.retrieve https://platform.openai.com/docs/api-reference/files/retrieve-contents
- files.delete https://platform.openai.com/docs/api-reference/files/delete
