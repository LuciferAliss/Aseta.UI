import {
  Avatar,
  HStack,
  Text,
  VStack,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "../../lib/contexts/AuthContext";
import type { Comment } from "../../types/comment";
import { useTranslation } from "react-i18next";

interface CommentCardProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
}

const CommentCard = ({ comment, onDelete }: CommentCardProps) => {
  const { user } = useAuth();
  const { t } = useTranslation("inventoryPage");
  const canDelete = user?.email === comment.email || user?.role === "Admin";

  return (
    <HStack
      spacing={4}
      align="start"
      w="full"
      p={4}
      borderWidth="1px"
      borderRadius="md"
    >
      <Avatar name={comment.userName} />
      <VStack align="start" spacing={1} flex="1">
        <HStack w="full">
          <Text fontWeight="bold">{comment.userName}</Text>
          <Text fontSize="sm" color="text-secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </Text>
          <Spacer />
          {canDelete && (
            <IconButton
              aria-label={t("comments.deleteAriaLabel")}
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => onDelete(comment.id)}
            />
          )}
        </HStack>
        <Text whiteSpace="pre-wrap">{comment.content}</Text>
      </VStack>
    </HStack>
  );
};

export default CommentCard;
