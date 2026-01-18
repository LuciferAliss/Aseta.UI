import { VStack, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { Comment } from "../../types/comment";
import CommentCard from "./CommentCard";
import AddCommentForm from "./AddCommentForm";

interface CommentsSectionProps {
  inventoryId: string;
  comments: Comment[];
  onCommentAdded: () => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentsSection = ({
  inventoryId,
  comments,
  onCommentAdded,
  onDeleteComment,
}: CommentsSectionProps) => {
  const { t } = useTranslation("inventoryPage");

  return (
    <VStack as="section" spacing={6} align="stretch">
      <Heading size="lg">{t("comments.sectionTitle")}</Heading>
      <AddCommentForm
        inventoryId={inventoryId}
        onCommentAdded={onCommentAdded}
      />

      <VStack spacing={4} align="stretch">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={onDeleteComment}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default CommentsSection;
