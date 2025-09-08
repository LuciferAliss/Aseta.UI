import { Box, VStack, Text, Input, Button, HStack, Avatar, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: number;
  author: { name: string; avatarUrl: string };
  text: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  { id: 1, author: { name: 'Admin', avatarUrl: '' }, text: 'Welcome to the discussion!', timestamp: new Date().toLocaleTimeString() },
];

const DiscussionsTab = ({ inventoryId }: { inventoryId: string }) => {
  const { t } = useTranslation('global');
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), author: { name: 'Guest', avatarUrl: '' }, text: 'This is a new message.', timestamp: new Date().toLocaleTimeString() }
      ]);
    }, 5000); 
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), author: { name: user.userName, avatarUrl: '' }, text: newMessage, timestamp: new Date().toLocaleTimeString() }
    ]);
    setNewMessage('');
  };
  
  return (
    <VStack spacing={4} align="stretch">
      <Box h="50vh" overflowY="auto" p={4} borderWidth="1px" borderRadius="md">
        <VStack spacing={4} align="stretch">
          {messages.map(msg => (
            <HStack key={msg.id} align="start">
              <Avatar size="sm" name={msg.author.name} src={msg.author.avatarUrl} />
              <Box bg={bgColor} p={3} borderRadius="md" w="100%">
                <HStack justify="space-between">
                  <Text fontWeight="bold">{msg.author.name}</Text>
                  <Text fontSize="xs" color="gray.500">{msg.timestamp}</Text>
                </HStack>
                <Text mt={1}>{msg.text}</Text>
              </Box>
            </HStack>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>
      <HStack as="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
        <Input 
          placeholder={t('inventoryPage.discussions.placeholder')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          isDisabled={!user}
        />
        <Button type="submit" colorScheme="teal" isDisabled={!user || !newMessage.trim()}>
          {t('inventoryPage.discussions.send')}
        </Button>
      </HStack>
    </VStack>
  );
};

export default DiscussionsTab;