import {
  Avatar,
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Image,
  Flex,
  AspectRatio,
  Container,
  Spacer,
  Divider,
  Button,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUserProfile } from "../lib/services/userService";
import type {
  InventoryProfileResponse,
  UserProfileResponse,
} from "../types/user";
import { useAppToast } from "../lib/hooks/useAppToast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import { useTranslation } from "react-i18next";

const InventoryCard = ({
  inventory,
}: {
  inventory: InventoryProfileResponse;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  return (
    <Container variant="card" p={0} overflow="hidden" flexDirection="column">
      <AspectRatio ratio={4 / 3} w="100%">
        <Image src={inventory.imageUrl} alt={inventory.name} objectFit="fill" />
      </AspectRatio>
      <Flex direction="column" p={4} flex="1" gap={3} minW="0">
        <Heading
          noOfLines={1}
          title={inventory.name}
          wordBreak="break-word"
          size="md"
        >
          {inventory.name}
        </Heading>
        <Text fontSize="sm" color="text-secondary">
          {t("inventoryCard.created")}:{" "}
          {new Date(inventory.createdAt).toLocaleDateString()}
        </Text>
        <Spacer />
        <Divider />
        <Button
          w="100%"
          mt={2}
          onClick={() =>
            navigate(ROUTES.inventory.replace(":id", inventory.id))
          }
        >
          {t("inventoryCard.viewButton")}
        </Button>
      </Flex>
    </Container>
  );
};

const ProfilePage = () => {
  const { t } = useTranslation("profile");
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useAppToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(t("loading_error"));
        showError(
          t("toasts.load_error_title"),
          t("toasts.load_error_description")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showError, t]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || !profile) {
    return (
      <Alert status="error" maxW="400px" mx="auto" mt={10}>
        <AlertIcon />
        {error || t("profile_not_loaded")}
      </Alert>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <VStack spacing={4} align="center" mb={10}>
        <Avatar size="2xl" name={profile.userName} />
        <Heading as="h1" size="2xl">
          {profile.userName}
        </Heading>
        <Text fontSize="lg" color="text-secondary">
          {profile.email}
        </Text>
        <Flex gap={2}>
          <Badge colorScheme="blue">{profile.role}</Badge>
          {profile.isLocked && (
            <Badge colorScheme="red">{t("lockedBadge")}</Badge>
          )}
        </Flex>
        <Text fontSize="sm" color="text-secondary">
          {t("memberSince")}: {new Date(profile.createdAt).toLocaleDateString()}
        </Text>
      </VStack>

      <Divider />

      <Box mt={10}>
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          {t("myInventoriesTitle")}
        </Heading>
        {profile.inventories.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {profile.inventories.map((inventory) => (
              <InventoryCard key={inventory.id} inventory={inventory} />
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" color="text-secondary">
            {t("noInventories")}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
