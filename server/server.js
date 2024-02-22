import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {Configuration, OpenAIApi} from 'openai';

dotenv.config();

const configuration = new Configuration({
	apiKey: process.OPENAI_API_KEY,
});

console.log(process.OPENAI_API_KEY);

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
  return `Generate a java library (optionally with its method) that does the input task.
Task: Generate a random number
Response: java.util.Random, Random.nextInt()
Task: Reproduce a sound
Response: javax.sound.sampled.AudioInputStream, javax.sound.sampled.AudioSystem, javax.sound.sampled.Clip
Task: make me an ice cream
Response: no existing library can do that (yet)
Task: ${capitalizedAnimal}`;
}

app.post('/', async (req,res) => {
	try{
		const prompt = req.body.prompt;
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: generatePrompt(prompt),
			temperature: 0.5,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0.1,
			presence_penalty: 0,
		});
		
		res.status(200).send({
			bot: response.data.choices[0].text
		})
	} catch (error){
		console.log(error);
		res.status(500).send({ error })
		
	}
})

app.listen(5000, () => console.log("El servidor está en https://localhost:5000"));