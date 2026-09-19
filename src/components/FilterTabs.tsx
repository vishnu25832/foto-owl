import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import { ImageFilter } from '../types/image';

interface FilterTabsProps {
  selectedFilter: ImageFilter;
  onFilterChange: (filter: ImageFilter) => void;
}

const filters: {
  label: string;
  value: ImageFilter;
}[] = [
  {
    label: 'All',
    value: 'ALL',
  },
  {
    label: 'Author A-M',
    value: 'A_M',
  },
  {
    label: 'Author N-Z',
    value: 'N_Z',
  },
];

export default function FilterTabs({
  selectedFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const selected =
          selectedFilter === filter.value;

        return (
          <Pressable
            key={filter.value}
            onPress={() =>
              onFilterChange(filter.value)
            }
            style={[
              styles.tab,
              selected && styles.selectedTab,
            ]}
          >
            <Text
              style={[
                styles.text,
                selected && styles.selectedText,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 14,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },

  selectedTab: {
    backgroundColor: '#2563EB',
  },

  text: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },

  selectedText: {
    color: '#FFFFFF',
  },
});