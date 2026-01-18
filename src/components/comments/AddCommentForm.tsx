import { useState } from "react";
import { Box, Button, Textarea, VStack, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { addComment } from "../../lib/services/commentService";
import { useAuth } from "../../lib/contexts/AuthContext";
import { useAppToast } from "../../lib/hooks/useAppToast";

interface AddCommentFormProps {
  inventoryId: string;
  onCommentAdded: () => void;
}

const AddCommentForm = ({
  inventoryId,
  onCommentAdded,
}: AddCommentFormProps) => {
  const { t } = useTranslation("inventoryPage");
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAppToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(inventoryId, content);
      setContent("");
      onCommentAdded();
      showSuccess(t("comments.addSuccess"));
    } catch (error) {
      showError(t("comments.addError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <VStack spacing={4} align="stretch">
        <Heading size="md">{t("comments.addComment")}</Heading>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("comments.placeholder")}
          isDisabled={isSubmitting}
        />
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!content.trim()}
          alignSelf="flex-end"
        >
          {t("comments.submit")}
        </Button>
      </VStack>
    </Box>
  );
};

export default AddCommentForm;
