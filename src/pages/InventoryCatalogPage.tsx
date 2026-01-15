import {
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
  Container,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { getInventories } from "../lib/services/inventoryService";
import { useAsyncList } from "react-stately";
import type {
  InventoryCatalogItem,
  GetInventoriesCatalogRequest,
  SortByType,
  SortOrderType,
} from "../types/inventory";
import InventoryCardList from "../components/inventoriesCatalog/InventoryCardList";
import InventoryTable from "../components/inventoriesCatalog/InventoryTable";
import { ViewIcon, ViewOffIcon, HamburgerIcon } from "@chakra-ui/icons";
import FilterSidebar from "../components/inventoriesCatalog/FilterSidebar";
import { Formik, type FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { VALIDATION_CONSTANTS } from "../lib/constants";
import { GetAllCategory } from "../lib/services/categoryService";
import { type CategoryResponse } from "../types/category";
import { getAllTags } from "../lib/services/tagService";
import type { TagResponse } from "../types/tag";

type ViewMode = "card" | "table";

export interface FilterFormValues {
  sortBy: SortByType;
  sortOrder: SortOrderType;
  pageSize: string;
  minItemsCount: string;
  maxItemsCount: string;
  createdAtFrom: string;
  createdAtTo: string;
  categoryIds: string[];
  tagIds: string[];
}

const LOCAL_STORAGE_FILTER_KEY = "inventoryFilters";

const DEFAULT_FILTERS: FilterFormValues = {
  sortBy: "Date",
  sortOrder: "desc",
  pageSize: "10",
  minItemsCount: "",
  maxItemsCount: "",
  createdAtFrom: "",
  createdAtTo: "",
  categoryIds: [],
  tagIds: [],
};

const InventoryCatalogPage = () => {
  const { t } = useTranslation("inventoryCatalog");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const [appliedFilters, setAppliedFilters] = useState<FilterFormValues>(() => {
    const savedFilters = localStorage.getItem(LOCAL_STORAGE_FILTER_KEY);
    return savedFilters ? JSON.parse(savedFilters) : DEFAULT_FILTERS;
  });
  const [hasNextPage, setHasNextPage] = useState(true);

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { ref, inView } = useInView({
    rootMargin: "300px",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetAllCategory();
        setCategories(response.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        setTags(response.tags);
      } catch (error) {
        console.error("Failed to fetch tags", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const loadItems = useCallback(
    async ({ cursor }: { cursor?: string }) => {
      if (isLoadingCategories || isLoadingTags) {
        return { items: [], cursor: undefined };
      }

      const { createdAtFrom, createdAtTo, categoryIds, tagIds } =
        appliedFilters;
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

      const request: GetInventoriesCatalogRequest = {
        sortBy: appliedFilters.sortBy,
        sortOrder: appliedFilters.sortOrder,
        pageSize: Number(appliedFilters.pageSize),
        minItemsCount: Number(appliedFilters.minItemsCount) || undefined,
        maxItemsCount: Number(appliedFilters.maxItemsCount) || undefined,
        createdAtFrom: fromUtc,
        createdAtTo: toUtc,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        cursor: cursor || undefined,
      };

      const response = await getInventories(request);
      setHasNextPage(response.inventories.hasNextPage);
      return {
        items: response.inventories.items,
        cursor: response.inventories.cursor ?? undefined,
      };
    },
    [appliedFilters, isLoadingCategories, isLoadingTags]
  );

  const list = useAsyncList<InventoryCatalogItem, string>({
    load: loadItems,
  });

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!isLoadingCategories && !isLoadingTags) {
      list.reload();
    }
  }, [appliedFilters, isLoadingCategories, isLoadingTags]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_FILTER_KEY,
      JSON.stringify(appliedFilters)
    );
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
    if (
      minItemsCount !== "" &&
      minItemsCount !== undefined &&
      minItemsCount !== null &&
      !Number.isInteger(Number(minItemsCount))
    ) {
      errors.minItemsCount = t(
        "filter_sidebar.validationErrors.minItemsCount.integer"
      );
    } else if (Number(minItemsCount) < INVENTORY_FILTER.ITEMS_COUNT.MIN) {
      errors.minItemsCount = t(
        "filter_sidebar.validationErrors.minItemsCount.min"
      );
    }

    // Items Max Count
    if (
      maxItemsCount !== "" &&
      maxItemsCount !== undefined &&
      maxItemsCount !== null &&
      !Number.isInteger(Number(maxItemsCount))
    ) {
      errors.maxItemsCount = t(
        "filter_sidebar.validationErrors.maxItemsCount.integer"
      );
    } else if (Number(maxItemsCount) < INVENTORY_FILTER.ITEMS_COUNT.MIN) {
      errors.maxItemsCount = t(
        "filter_sidebar.validationErrors.maxItemsCount.min"
      );
    } else if (
      minItemsCount !== "" &&
      minItemsCount !== undefined &&
      minItemsCount !== null &&
      Number.isInteger(Number(minItemsCount)) &&
      maxItemsCount !== "" &&
      maxItemsCount !== undefined &&
      maxItemsCount !== null &&
      Number.isInteger(Number(maxItemsCount)) &&
      Number(maxItemsCount) < Number(minItemsCount)
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
    categoryIds: appliedFilters.categoryIds ?? [],
    tagIds: appliedFilters.tagIds ?? [],
  };

  const handleResetFilters = (formikProps: FormikProps<FilterFormValues>) => {
    setAppliedFilters(DEFAULT_FILTERS);
    formikProps.resetForm({ values: DEFAULT_FILTERS });
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
            categoryIds: values.categoryIds,
            tagIds: values.tagIds,
          };
          setAppliedFilters(newFilters);
          onClose();
        }}
        enableReinitialize
      >
        {(props) => (
          <>
            {isDesktop ? (
              <Container
                variant="card"
                as="aside"
                position="sticky"
                w="xs"
                boxShadow="none"
                p={6}
              >
                <FilterSidebar
                  {...props}
                  onReset={() => handleResetFilters(props)}
                  categories={categories}
                  isLoadingCategories={isLoadingCategories}
                  tags={tags}
                  isLoadingTags={isLoadingTags}
                />
              </Container>
            ) : (
              <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerBody>
                    <FilterSidebar
                      {...props}
                      onReset={() => handleResetFilters(props)}
                      categories={categories}
                      isLoadingCategories={isLoadingCategories}
                      tags={tags}
                      isLoadingTags={isLoadingTags}
                    />
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
        {(list.isLoading && list.items.length === 0) ||
        isLoadingCategories ||
        isLoadingTags ? (
          <Center h="200px">
            <Spinner size="xl" />
          </Center>
        ) : effectiveViewMode === "card" ? (
          <InventoryCardList inventories={list.items} />
        ) : (
          <InventoryTable inventories={list.items} />
        )}

        <Center ref={ref} h="100px">
          {list.isLoading && hasNextPage && <Spinner size="xl" />}
          {!list.isLoading && (!hasNextPage || list.items.length === 0) && (
            <Text>{t("noMoreItems")}</Text>
          )}
        </Center>
      </VStack>
    </Flex>
  );
};

export default InventoryCatalogPage;
