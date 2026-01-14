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
import { useTranslation } from "react-i18next";

const CardInventory = (inventory: InventoryItem) => {
  const { t } = useTranslation("inventoryCatalog");

  return (
    <Container variant="card" p={0} overflow="hidden" flexDirection="column">
      <AspectRatio ratio={4 / 3} w="100%">
        <Image src={inventory.imageUrl} alt={inventory.name} objectFit="fill" />
      </AspectRatio>

      <Flex direction="column" p={4} flex="1" gap={3} minW="0">
        <Heading noOfLines={1} title={inventory.name} wordBreak="break-word">
          {inventory.name}
        </Heading>

        <Text fontSize="sm" color="text-secondary">
          {t("card.item_count")} {inventory.itemsCount}
        </Text>

        <Text fontSize="sm" color="text-secondary">
          {t("card.created_at")}{" "}
          {new Date(inventory.createdAt).toLocaleString()}
        </Text>

        <Text fontSize="sm" color="text-secondary">
          {t("card.creator")} {inventory.creatorName}
        </Text>

        <Spacer />

        <Divider />

        <Button w="100%" mt={2}>
          {t("card.view_button")}
        </Button>
      </Flex>
    </Container>
  );
};

export default CardInventory;
