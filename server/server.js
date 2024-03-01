import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {Configuration, OpenAIApi} from 'openai';

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', async(req, res) => {
	res.status(200).send({
		message: 'que pasa crack',
	})
});
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Generate a java library (optionally with its method) that does the last input task. Respond in a JSON format like in the following examples:
Task: Generate a random number
Your response: {"Response": "java.util.Random, Random.nextInt()"}
Task: Reproduce a sound
Your response: {"Response": "javax.sound.sampled.AudioInputStream, javax.sound.sampled.AudioSystem, javax.sound.sampled.Clip"}
Task: make me an ice cream
Your response: {"Response": "no existing library can do that (yet)"}
Task: ${capitalizedAnimal}
Now, complete your response:`;
}

app.post('/', async (req,res) => {
	try{
		const prompt = req.body.prompt;
		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo-1106",
			response_format: {type: "json_object"},
			messages:[
				{
					role: "system",
					content:
						`You are a helpful assistant.`,
				},
				{
					role: "user",
					content: 
						`${generatePrompt(prompt)}`,
				}
			],
			
			
		});
		
		res.status(200).send({
			bot: response.data.choices[0].message.response
		});

		// Esperar antes de hacer la próxima solicitud
		await delay(1000); // Espera 1 segundo
	} catch (error){
		console.log(error);
		alert(error);
		res.status(500).send({ error });
	}
})

app.listen(5000, () => console.log("El servidor está en https://localhost:5000"));