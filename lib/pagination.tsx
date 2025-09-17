// @/lib/pagination.tsx
import { useTheme } from "@/context/themecontext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PaginationProps {
  offset: number;
  limit: number;
  totalRecords: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  offset,
  limit,
  totalRecords,
  onPrevious,
  onNext,
}) => {
  const { colors } = useTheme();

  const isPrevDisabled = offset === 0;
  const isNextDisabled = offset + limit >= totalRecords;

  const records = totalRecords > 0 ? offset + 1 : 0;
  const recordLimit =
    offset + limit > totalRecords ? totalRecords : offset + limit;

  const styles = StyleSheet.create({
    paginationBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: colors.tabIconDefault,
      backgroundColor: colors.background,
    },
    paginationText: {
      fontSize: 14,
      color: colors.text,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    buttonText: {
      fontSize: 16,
      color: colors.tint, // Active color
    },
    disabledButtonText: {
      color: colors.tabIconDefault, // Disabled color
    },
  });

  return (
    <View style={styles.paginationBar}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPrevious}
        disabled={isPrevDisabled}
      >
        <Text
          style={[
            styles.buttonText,
            isPrevDisabled && styles.disabledButtonText,
          ]}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <Text style={styles.paginationText}>
        {`Showing ${records}-${recordLimit} of ${totalRecords}`}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onNext}
        disabled={isNextDisabled}
      >
        <Text
          style={[
            styles.buttonText,
            isNextDisabled && styles.disabledButtonText,
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
