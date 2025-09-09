import { Box, Heading, Link as ChakraLink, Spinner, Tag, Wrap, WrapItem, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import type { Tag as TagType } from '../../types/inventory';
import { useInventory } from '../../hooks/useInventory';
import { useEffect, useState } from 'react';

const TagCloud = () => {
  const { t } = useTranslation('global');
  
  const { getTagsCloud } = useInventory();
    
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  
  useEffect(() => {
    const fetchSidebarData = async () => {
      setIsLoading(true);
      try {
        const tags = await getTagsCloud();
        setTags(tags.collection || []);
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setIsLoading(false);
      } 
    };
    fetchSidebarData();
  }, []);

  return (
    <Box as="section">
      <Heading as="h2" size="md" mb={4}>{t('mainPage.tags.title')}</Heading>
      {isLoading ? (
        <Center h="200px"><Spinner /></Center>
      ) : (
        <Wrap spacing={3} align="center" justify="center">
          {tags.map((tag) => (
            <WrapItem key={`${tag.id}-${tag.name}`}>
              <ChakraLink as={RouterLink} to={`/search?tag=${encodeURIComponent(tag.name)}`} _hover={{ textDecoration: 'none', transform: 'scale(1.05)' }} transition="transform 0.2s">
                <Tag variant="solid" boxShadow="md" borderRadius="md">
                  {tag.name}
                </Tag>
              </ChakraLink>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Box>
  );
};

export default TagCloud;