import {
  Alert,
  Modal,
  Linking,
  Share,
  RefreshControl,
  Clipboard,
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback } from "react";
import { COLORS, SIZES } from "@/constants";
import ApiFeed from "../components/ApiFeed";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingImage from "../components/loadingStates/LoadingImage";
import TextButton from "../components/TextButton";
import ErrorImage from "../components/loadingStates/ErrorImage";
import { AUTH_FEEDS } from "@/Redux/URL";
import axios, { AxiosError } from "axios";
import { RootState } from "@/Redux/store";

interface FeedItem {
  id: string | number;
}

const Home = () => {
  const [isReferModalVisible, setIsReferModalVisible] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedFeed, setFetchedFeed] = useState<FeedItem[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, availableCoins } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("access_token");
        if (value !== null) {
          setAccessToken(value);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  async function fetchFeed(accessToken: string) {
    setLoading(true);
    try {
      const response = await axios.get(AUTH_FEEDS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const feed = response?.data?.incident_reports;
      if (feed) {
        const feedData = Array.isArray(feed) ? feed : [];
        setFetchedFeed(feedData);
        console.log("HomeScreen feed loaded:", feedData.length, "items");
      } else {
        console.log("No incident_reports in response, available keys:", Object.keys(response?.data || {}));
        throw new Error("No feed data received");
      }
    } catch (error) {
      console.log("Feed fetch error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchFeed(accessToken);
    }
  }, [accessToken]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchFeed(accessToken);
    } catch (error) {
      console.log('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [accessToken]);

  if (loading) return <LoadingImage />;

  if (error)
    return (
      <View style={styles.errorStyle}>
        <ErrorImage />
        <Text style={{ color: "red", fontSize: 12, fontWeight: "400", textAlign: "center" }}>
          Failed to load Feed, please check your network connection or click to refresh
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TextButton
            label="Refresh"
            buttonContainerStyle={{
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderRadius: SIZES.radius,
              backgroundColor: "#0E9C67",
            }}
            labelStyle={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
            }}
            onPress={() => fetchFeed(accessToken)}
          />
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Refer a friend modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isReferModalVisible}
        onRequestClose={() => setIsReferModalVisible(false)}
      >
        <View style={styles.referModal}>
          <View style={styles.modalContent}>
            {/* Header with icon */}
            <View style={styles.headerContainer}>
              <Text style={{ fontSize: 80 }}>🎉</Text>
              <Text style={styles.headerText}>
                Earn 20 Points for each friend you refer!
              </Text>
            </View>

            {/* Referral code */}
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>
                {availableCoins?.referral_code || 'Loading...'}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    if (availableCoins?.referral_code) {
                      await Clipboard.setString(availableCoins.referral_code);
                      Alert.alert('Copied!', 'Referral code copied to clipboard');
                    } else {
                      Alert.alert('Error', 'Referral code not available');
                    }
                  } catch (error) {
                    console.error('Failed to copy:', error);
                    Alert.alert('Error', 'Failed to copy referral code');
                  }
                }}
                disabled={!availableCoins?.referral_code}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={availableCoins?.referral_code ? COLORS.primary : COLORS.gray}
                />
              </TouchableOpacity>
            </View>

            {/* Action buttons */}
            <View style={styles.iconsWrapper}>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  disabled={isSharing}
                  onPress={async () => {
                    try {
                      setIsSharing(true);
                      const referralCode = availableCoins?.referral_code || 'contact admin';
                      const playStoreLink = 'https://play.google.com/store/apps/details?id=com.kennedy757.citixenx';
                      const message = `Hey! Check out this amazing app! Use my referral code ${referralCode} to get 20 points! Download it now!\n\n${playStoreLink}`;

                      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
                      const supported = await Linking.canOpenURL(whatsappUrl);

                      if (supported) {
                        await Linking.openURL(whatsappUrl);
                      } else {
                        await Share.share({
                          message: message,
                          title: 'Share via WhatsApp'
                        });
                      }
                    } catch (error) {
                      console.error('WhatsApp share error:', error);
                      Alert.alert('Error', 'Could not share. Please try again.');
                    } finally {
                      setIsSharing(false);
                    }
                  }}
                >
                  <FontAwesome name="whatsapp" size={28} color="#25D366" />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isSharing}
                  onPress={async () => {
                    try {
                      setIsSharing(true);
                      const referralCode = availableCoins?.referral_code || 'contact admin';
                      const playStoreLink = 'https://play.google.com/store/apps/details?id=com.kennedy757.citixenx';
                      const message = `Hey! Check out this amazing app! Use my referral code ${referralCode} to get 20 points! Download it now!\n\n${playStoreLink}`;

                      await Share.share({
                        message: message,
                        url: playStoreLink,
                        title: 'Share via Facebook'
                      });
                    } catch (error) {
                      console.error('Facebook share error:', error);
                      Alert.alert('Error', 'Could not share. Please try again.');
                    } finally {
                      setIsSharing(false);
                    }
                  }}
                >
                  <FontAwesome name="facebook-square" size={28} color="#4267B2" />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isSharing}
                  onPress={async () => {
                    try {
                      setIsSharing(true);
                      const referralCode = availableCoins?.referral_code || 'contact admin';
                      const playStoreLink = 'https://play.google.com/store/apps/details?id=com.kennedy757.citixenx';
                      const message = `Hey! Check out this amazing app! Use my referral code ${referralCode} to get 20 points! Download it now!\n\n${playStoreLink}`;

                      await Share.share({
                        message: message,
                        url: playStoreLink,
                        title: 'Share via Instagram'
                      });
                    } catch (error) {
                      console.error('Instagram share error:', error);
                      Alert.alert('Error', 'Could not share. Please try again.');
                    } finally {
                      setIsSharing(false);
                    }
                  }}
                >
                  <FontAwesome name="instagram" size={28} color="#E1306C" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Earnings and fine print */}
            <Text style={styles.earningsText}>
              Total earned: <Text style={styles.earningsAmount}>
                {availableCoins?.total_balance !== undefined ? availableCoins.total_balance : '...'} Points
              </Text>
            </Text>
            <Text style={styles.finePrint}>
              You will receive 20 points and your friend will receive 20 points on their first report.
            </Text>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsReferModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.top}>
        <Text style={{ fontSize: 19, color: COLORS.primary, fontWeight: "700", marginLeft: 15 }}>
          Reports Feed
        </Text>
        <TouchableOpacity
          onPress={() => setIsReferModalVisible(true)}
          style={{ marginRight: 15 }}
        >
          <Text>Refer a friend</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Array.isArray(fetchedFeed) ? fetchedFeed : []}
        renderItem={({ item }) => <ApiFeed item={item} />}
        keyExtractor={(item) => item.id?.toString?.() || String(item.id)}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 105 }} />}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
            <Text style={{ fontSize: 16, color: COLORS.gray, textAlign: 'center' }}>
              No feed items to display
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.darkGray, textAlign: 'center', marginTop: 8 }}>
              Pull down to refresh or check your connection
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "white",
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
    height: 30,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  referModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    width: '90%',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: COLORS.primary,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray3,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 32,
    justifyContent: 'space-between',
    width: '100%',
  },
  codeText: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  iconsWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  earningsText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  earningsAmount: {
    fontWeight: 'bold',
  },
  finePrint: {
    fontSize: 12,
    color: COLORS.gray3,
    marginBottom: 24,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
