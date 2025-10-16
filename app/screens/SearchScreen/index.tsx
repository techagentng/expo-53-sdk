import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const filteredData = params.filteredData ? JSON.parse(params.filteredData as string) : [];
  const reportType = params.reportType as string;
  const selectedState = params.selectedState as string;
  const selectedLocalGov = params.selectedLocalGov as string;

  const renderReportItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.reportItem}>
      <View style={styles.reportContent}>
        <Text style={styles.reportTitle}>{item.report_type_name}</Text>
        <Text style={styles.reportLocation}>
          {item.state_name}, {item.lga_name}
        </Text>
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.reportDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
      </View>

      <View style={styles.filterInfo}>
        <Text style={styles.filterText}>
          Showing {filteredData?.length || 0} reports
        </Text>
        {(reportType || selectedState) && (
          <Text style={styles.filterDetails}>
            Filter: {reportType && `Type: ${reportType}`}
            {reportType && selectedState && ' • '}
            {selectedState && `State: ${selectedState}`}
            {selectedLocalGov && ` • LGA: ${selectedLocalGov}`}
          </Text>
        )}
      </View>

      {filteredData && filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No reports found matching your criteria.</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search filters or select different options.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  filterInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.lightOrange,
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  filterDetails: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reportItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  reportLocation: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 8,
    lineHeight: 20,
  },
  reportDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
