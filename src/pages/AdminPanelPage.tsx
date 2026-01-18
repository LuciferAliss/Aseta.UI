import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { useState } from "react";
import TagManagement from "../components/admin/TagManagement";
import CategoryManagement from "../components/admin/CategoryManagement";
import UserManagement from "../components/admin/UserManagement";
import { useTranslation } from "react-i18next";
import AdminMobileNav from "../components/admin/AdminMobileNav";

const AdminPanelPage = () => {
  const { t } = useTranslation("admin");
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Heading mb={8}>{t("title")}</Heading>
      <AdminMobileNav setTabIndex={setTabIndex} />
      <Tabs
        index={tabIndex}
        onChange={setTabIndex}
        variant="enclosed"
        isLazy
      >
        <TabList display={{ base: "none", md: "flex" }}>
          <Tab>{t("tags.title")}</Tab>
          <Tab>{t("categories.title")}</Tab>
          <Tab>{t("users.title")}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TagManagement />
          </TabPanel>
          <TabPanel>
            <CategoryManagement />
          </TabPanel>
          <TabPanel>
            <UserManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminPanelPage;
