import { Flex } from '@chakra-ui/react';
import './App.css'
import AppRouter from './routes/AppRouter';

function App() {
	return (
		<Flex 
			h={'100vh'} 
			w={'100vw'}
		>
				<AppRouter />
		</Flex>
	)
}

export default App