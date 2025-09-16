// Pagination.tsx
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

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
  const records = totalRecords > 0 ? offset + 1 : 0;
  const recordLimit =
    offset + limit > totalRecords ? totalRecords : offset + limit;

  return (
    <View style={styles.paginationBar}>
      <Button title="Previous" onPress={onPrevious} disabled={offset === 0} />
      <Text style={styles.paginationText}>
        {`Showing ${records}-${recordLimit} of ${totalRecords}`}
      </Text>
      <Button
        title="Next"
        onPress={onNext}
        disabled={offset + limit >= totalRecords}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paginationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f8f8f8",
  },
  paginationText: {
    fontSize: 14,
    color: "#333",
  },
});

export default Pagination;
