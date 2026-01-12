import {
  Box,
  VStack,
  HStack,
  Spinner,
  Center,
  IconButton,
  Text,
  useBreakpointValue,
  Flex,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { getInventories } from "../lib/services/inventoryService";
import { useAsyncList } from "react-stately";
import type {
  InventoryItem,
  GetInventoriesRequest,
  SortByType,
} from "../types/inventory";
import InventoryCardList from "../components/inventories/InventoryCardList";
import InventoryTable from "../components/inventories/InventoryTable";
import { ViewIcon, ViewOffIcon, HamburgerIcon } from "@chakra-ui/icons";
import FilterSidebar from "../components/inventories/FilterSidebar";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { VALIDATION_CONSTANTS } from "../lib/constants";

type ViewMode = "card" | "table";

export interface FilterFormValues {
  sortBy: SortByType;
  sortOrder: "asc" | "desc";
  pageSize: string;
  minItemsCount: string;
  maxItemsCount: string;
  createdAtFrom: string;
  createdAtTo: string;
}

const InventoryCatalogPage = () => {
  const { t } = useTranslation("inventoryCatalog");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<FilterFormValues>({
    sortBy: "Date",
    sortOrder: "desc",
    pageSize: "10",
    minItemsCount: "",
    maxItemsCount: "",
    createdAtFrom: "",
    createdAtTo: "",
  });
  const [hasNextPage, setHasNextPage] = useState(true);

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { ref, inView } = useInView({
    rootMargin: "300px",
  });

  const loadItems = useCallback(
    async ({ cursor }: { cursor?: string }) => {
      const { createdAtFrom, createdAtTo } = appliedFilters;
      let fromUtc: string | undefined;
      if (createdAtFrom) {
        const fromDate = new Date(createdAtFrom);
        fromUtc = fromDate.toISOString();
      }
      let toUtc: string | undefined;
      if (createdAtTo) {
        const toDate = new Date(createdAtTo);
        toUtc = toDate.toISOString();
      }

      const request: GetInventoriesRequest = {
        sortBy: appliedFilters.sortBy,
        sortOrder: appliedFilters.sortOrder,
        pageSize: Number(appliedFilters.pageSize),
        minItemsCount: Number(appliedFilters.minItemsCount) || undefined,
        maxItemsCount: Number(appliedFilters.maxItemsCount) || undefined,
        createdAtFrom: fromUtc,
        createdAtTo: toUtc,
        cursor: cursor || undefined,
      };

      const response = await getInventories(request);

      setHasNextPage(response.inventories.hasNextPage);

      return {
        items: response.inventories.items,
        cursor: response.inventories.cursor ?? undefined,
      };
    },
    [appliedFilters]
  );

  const list = useAsyncList<InventoryItem, string>({
    load: loadItems,
  });

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    list.reload();
  }, [appliedFilters]);

  useEffect(() => {
    if (inView && !list.isLoading && hasNextPage) {
      list.loadMore();
    }
  }, [inView, list, hasNextPage]);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem("inventoryViewMode") as ViewMode) || "card";
  });

  const toggleViewMode = () => {
    const newViewMode = viewMode === "card" ? "table" : "card";
    setViewMode(newViewMode);
    localStorage.setItem("inventoryViewMode", newViewMode);
  };

  const effectiveViewMode = isDesktop ? viewMode : "card";

  const toggleViewButton = (
    <IconButton
      aria-label="Toggle view"
      icon={viewMode === "card" ? <ViewOffIcon /> : <ViewIcon />}
      onClick={toggleViewMode}
    />
  );

  const filtersButton = (
    <IconButton
      aria-label="Open filters"
      icon={<HamburgerIcon />}
      onClick={onOpen}
    />
  );

  const validateFilters = (values: any) => {
    const errors: Record<string, string> = {};
    const { pageSize, minItemsCount, maxItemsCount } = values;
    const { INVENTORY_FILTER } = VALIDATION_CONSTANTS;

    // Page Size
    if (pageSize === "" || pageSize === undefined || pageSize === null) {
      errors.pageSize = t("filter_sidebar.validationErrors.pageSize.required");
    } else if (!Number.isInteger(Number(pageSize))) {
      errors.pageSize = t("filter_sidebar.validationErrors.pageSize.integer");
    } else if (Number(pageSize) < INVENTORY_FILTER.PAGE_SIZE.MIN) {
      errors.pageSize = t("filter_sidebar.validationErrors.pageSize.min", {
        min: INVENTORY_FILTER.PAGE_SIZE.MIN,
      });
    } else if (Number(pageSize) > INVENTORY_FILTER.PAGE_SIZE.MAX) {
      errors.pageSize = t("filter_sidebar.validationErrors.pageSize.max", {
        max: INVENTORY_FILTER.PAGE_SIZE.MAX,
      });
    }

    // Items Min Count
    const minCount = minItemsCount;
    if (
      minCount !== "" &&
      minCount !== undefined &&
      minCount !== null &&
      !Number.isInteger(Number(minCount))
    ) {
      errors.minItemsCount = t(
        "filter_sidebar.validationErrors.minItemsCount.integer"
      );
    } else if (
      minCount !== "" &&
      minCount !== undefined &&
      minCount !== null &&
      Number(minCount) < INVENTORY_FILTER.ITEMS_COUNT.MIN
    ) {
      errors.minItemsCount = t(
        "filter_sidebar.validationErrors.minItemsCount.min"
      );
    }

    // Items Max Count
    const maxCount = maxItemsCount;
    if (
      maxCount !== "" &&
      maxCount !== undefined &&
      maxCount !== null &&
      !Number.isInteger(Number(maxCount))
    ) {
      errors.maxItemsCount = t(
        "filter_sidebar.validationErrors.maxItemsCount.integer"
      );
    } else if (
      maxCount !== "" &&
      maxCount !== undefined &&
      maxCount !== null &&
      Number(maxCount) < INVENTORY_FILTER.ITEMS_COUNT.MIN
    ) {
      errors.maxItemsCount = t(
        "filter_sidebar.validationErrors.maxItemsCount.min"
      );
    }

    // Cross-validation
    if (
      minCount !== "" &&
      minCount !== undefined &&
      minCount !== null &&
      !Number.isInteger(Number(minCount)) &&
      maxCount !== "" &&
      maxCount !== undefined &&
      maxCount !== null &&
      !Number.isInteger(Number(maxCount)) &&
      Number(maxCount) < Number(minCount)
    ) {
      errors.maxItemsCount = t(
        "filter_sidebar.validationErrors.maxItemsCount.greater"
      );
    }

    // Date filters
    const createdAtFrom = values.createdAtFrom;
    const createdAtTo = values.createdAtTo;

    const dateFrom = createdAtFrom ? new Date(createdAtFrom) : null;
    const dateTo = createdAtTo ? new Date(createdAtTo) : null;

    if (createdAtFrom && (dateFrom === null || isNaN(dateFrom.getTime()))) {
      errors.createdAtFrom = t(
        "filter_sidebar.validationErrors.createdAtFrom.invalid"
      );
    }

    if (createdAtTo && (dateTo === null || isNaN(dateTo.getTime()))) {
      errors.createdAtTo = t(
        "filter_sidebar.validationErrors.createdAtTo.invalid"
      );
    }

    if (dateFrom && dateTo && dateFrom.getTime() > dateTo.getTime()) {
      errors.createdAtTo = t(
        "filter_sidebar.validationErrors.createdAtTo.beforeFrom"
      );
    }

    return errors;
  };

  const formikInitialValues: FilterFormValues = {
    ...appliedFilters,
    minItemsCount: appliedFilters.minItemsCount ?? "",
    maxItemsCount: appliedFilters.maxItemsCount ?? "",
  };

  return (
    <Flex direction={{ base: "column", lg: "row" }} p={8} align="start" gap={6}>
      <Formik
        initialValues={formikInitialValues}
        validate={validateFilters}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => {
          const newFilters: FilterFormValues = {
            sortBy: values.sortBy,
            sortOrder: values.sortOrder,
            pageSize: values.pageSize,
            minItemsCount: values.minItemsCount,
            maxItemsCount: values.maxItemsCount,
            createdAtFrom: values.createdAtFrom,
            createdAtTo: values.createdAtTo,
          };
          setAppliedFilters(newFilters);
          onClose();
        }}
        enableReinitialize
      >
        {(props) => (
          <>
            {isDesktop ? (
              <Box
                as="aside"
                borderWidth="3px"
                borderRadius="lg"
                boxShadow="lg"
                position="sticky"
              >
                <FilterSidebar {...props} />
              </Box>
            ) : (
              <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerBody>
                    <FilterSidebar {...props} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            )}
          </>
        )}
      </Formik>

      <VStack as="main" flex="1" spacing={4} align="stretch" w="100%">
        <HStack justifyContent="flex-end">
          <Input
            placeholder="Search inventories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isDesktop ? toggleViewButton : filtersButton}
        </HStack>
        {list.isLoading && list.items.length === 0 ? (
          <Center h="200px">
            <Spinner size="xl" />
          </Center>
        ) : effectiveViewMode === "card" ? (
          <InventoryCardList inventories={list.items} />
        ) : (
          <InventoryTable inventories={list.items} />
        )}

        <Center ref={ref} h="100px">
          {list.isLoading && list.items.length > 0 && <Spinner size="xl" />}
          {!hasNextPage && !list.isLoading && <Text>No more inventories</Text>}
        </Center>
      </VStack>
    </Flex>
  );
};

export default InventoryCatalogPage;
