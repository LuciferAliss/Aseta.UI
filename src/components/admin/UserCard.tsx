import {
  Box,
  Flex,
  IconButton,
  Text,
  Spacer,
  Tooltip,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { UnlockIcon, LockIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import type { UserResponse } from "../../types/user";

interface UserCardProps {
  user: UserResponse;
  onBlockUser?: (id: string) => void;
  onUnblockUser?: (id: string) => void;
}

const UserCard = ({ user, onBlockUser, onUnblockUser }: UserCardProps) => {
  const { t } = useTranslation("admin");

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      w="full"
      position="relative"
    >
      <VStack spacing={3} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Tooltip label={user.userName} placement="top" hasArrow>
            <Text fontWeight="bold" noOfLines={1} minW={0}>
              {user.userName}
            </Text>
          </Tooltip>
          <Spacer />
          <Badge colorScheme={user.isLocked ? "red" : "green"}>
            {user.isLocked ? "Locked" : "Active"}
          </Badge>
        </Flex>
        <Tooltip label={user.email} placement="top" hasArrow>
          <Text fontSize="sm" noOfLines={1}>
            {user.email}
          </Text>
        </Tooltip>
        <Flex justifyContent="flex-end" alignItems="center" mt={2}>
          {onBlockUser && !user.isLocked && (
            <IconButton
              aria-label={t("users.block")}
              icon={<LockIcon />}
              size="sm"
              variant="ghost"
              mr={1}
              onClick={() => onBlockUser(user.id)}
            />
          )}
          {onUnblockUser && user.isLocked && (
            <IconButton
              aria-label={t("users.unlock")}
              icon={<UnlockIcon />}
              size="sm"
              variant="ghost"
              mr={1}
              onClick={() => onUnblockUser(user.id)}
            />
          )}
        </Flex>
      </VStack>
    </Box>
  );
};

export default UserCard;
