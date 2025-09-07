import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useInventory } from "../hooks/useInventory";

const InventoryPage = () => {
  const { t } = useTranslation();
  const { getInventory } = useInventory();
  
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getIn();
        const a = data.collection;
        setCategories(a);
      } catch (error) {
        toast({
          title: t('createPage.toast.categoriesErrorTitle'),
          description: t('createPage.toast.categoriesErrorDescription'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    if (id) {
      
    }
  }, [id]);

  return(
      <div>InventoryPage</div>
  )
};

export default InventoryPage