import {
  Image,
  Heading,
  Text,
  Divider,
  Button,
  AspectRatio,
  Flex,
  Spacer,
  Container,
} from "@chakra-ui/react";
import type { InventoryItem } from "../../types/inventory";

// 2. Делаем деструктуризацию: ({ inventory })
const CardInventory = (inventory: InventoryItem) => {
  return (
    <Container variant="card" p={0} overflow="hidden" flexDirection="column">
      <AspectRatio ratio={4 / 3} w="100%">
        <Image src={inventory.imageUrl} alt={inventory.name} objectFit="fill" />
      </AspectRatio>

      <Flex
        direction="column"
        p={4}
        flex="1"
        gap={3}
        minW="0" // Защита от распирания
      >
        <Heading
          size="md"
          noOfLines={1}
          title={inventory.name}
          wordBreak="break-word"
        >
          {inventory.name}
        </Heading>

        <Text fontSize="2xl" fontWeight="bold">
          Item count: {inventory.itemsCount}
        </Text>

        <Text fontSize="sm" color="gray.500">
          Created at: {new Date(inventory.createdAt).toLocaleString()}
        </Text>

        <Text fontSize="sm" color="gray.500">
          Creator: {inventory.creatorName}
        </Text>

        <Spacer />

        <Divider />

        <Button w="100%" mt={2}>
          View
        </Button>
      </Flex>
    </Container>
  );
};

export default CardInventory;
