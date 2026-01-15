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
  Tag,
  Wrap,
  WrapItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  // Добавляем Portal, чтобы меню не обрезалось границами карточки (опционально)
  Portal,
} from "@chakra-ui/react";
import type { InventoryCatalogItem } from "../../types/inventory";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

const CardInventory = (inventory: InventoryCatalogItem) => {
  const { t } = useTranslation("inventoryCatalog");
  const navigate = useNavigate();

  // 1. Безопасное получение тегов. Больше не нужно делать slice.
  const tags = inventory.tags || [];

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
          {t("card.category")} {inventory.category.name}
        </Text>

        <Text fontSize="sm" color="text-secondary">
          {t("card.creator")} {inventory.creatorName}
        </Text>

        <Popover trigger="hover" placement="top-start" isLazy>
          <PopoverTrigger>
            <Tag
              size="md"
              variant="subtle"
              colorScheme="purple"
              cursor="help"
              w="fit-content"
            >
              {t("card.tag_title")}: {tags.length}
            </Tag>
          </PopoverTrigger>

          <Portal>
            <PopoverContent w="auto" maxW="300px" boxShadow="xl">
              <PopoverBody p={2}>
                <Wrap>
                  {tags.length === 0 ? (
                    <WrapItem>
                      <Tag size="sm" variant="solid" colorScheme="gray">
                        {t("card.no_tags")}
                      </Tag>
                    </WrapItem>
                  ) : (
                    tags.map((tag) => (
                      <WrapItem key={tag.id}>
                        <Tag size="sm" variant="solid" colorScheme="gray">
                          {tag.name}
                        </Tag>
                      </WrapItem>
                    ))
                  )}
                </Wrap>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>

        <Spacer />

        <Divider />

        <Button
          w="100%"
          mt={2}
          onClick={() =>
            navigate(ROUTES.inventory.replace(":id", inventory.id))
          }
        >
          {t("card.view_button")}
        </Button>
      </Flex>
    </Container>
  );
};

export default CardInventory;
