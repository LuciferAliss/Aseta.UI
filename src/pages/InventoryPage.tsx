import {
  Box,
  Image,
  Text,
  Spinner,
  Center,
  VStack,
  Heading,
  HStack,
  Tag,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInventoryById } from "../lib/services/inventoryService";
import type { InventoryResponse } from "../types/inventory";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const InventoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");
  const [inventory, setInventory] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getInventoryById(id)
        .then((data) => {
          setInventory(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!inventory) {
    return (
      <Center h="100vh">
        <Text>{t("inventoryNotFound")}</Text>
      </Center>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={5}>
      <VStack spacing={5} align="start">
        <Heading color="gray.800">{inventory.name}</Heading>
        <Image
          src={inventory.imageUrl}
          alt={inventory.name}
          borderRadius="md"
          boxSize="400px"
          objectFit="cover"
        />
        <Text fontSize="lg" color="gray.800">
          {inventory.description}
        </Text>
        <Divider />
        <Text color="gray.800">
          <strong>{t("creator")}:</strong> {inventory.creator}
        </Text>
        <Text color="gray.800">
          <strong>{t("category")}:</strong> {inventory.category.name}
        </Text>
        <Text color="gray.800">
          <strong>{t("createdAt")}:</strong>{" "}
          {format(new Date(inventory.createdAt), "PPP")}
        </Text>
        <HStack spacing={2}>
          <Text color="gray.800">
            <strong>{t("tags")}:</strong>
          </Text>
          {inventory.tags.map((tag) => (
            <Tag key={tag.id} size="md" variant="solid">
              {tag.name}
            </Tag>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default InventoryPage;
