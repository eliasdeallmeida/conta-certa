import { ReactNode, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { usePathname, Slot } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const pages = {
  "/tabs/home": "Início",
  "/tabs/profile": "Perfil",
  "/tabs/transactions": "Transações",
  "/tabs/transactions/add": "Adicionar Transação",
  "/tabs/transactions/[id]": "Editar Transação",
  "/tabs/categories": "Categorias",
  "/tabs/categories/add": "Adicionar Categoria",
  "/tabs/categories/[id]": "Editar Categoria",
};

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [menuVisible, setMenuVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  function getPageTitle(pathname: string) {
    if (pages[pathname]) return pages[pathname];
    if (/^\/tabs\/transactions\/\d+$/.test(pathname))
      return pages["/tabs/transactions/[id]"];
    if (/^\/tabs\/categories\/\d+$/.test(pathname))
      return pages["/tabs/categories/[id]"];
    return "App";
  }

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    router.replace("/auth/login");
  };

  const handleNavigation = (path: string) => {
    setMenuVisible(false);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          >
            <TouchableOpacity onPress={closeMenu} style={styles.menuClose}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>

            {[
              { label: "Início", path: "/tabs/home" },
              { label: "Transações", path: "/tabs/transactions" },
              { label: "Categorias", path: "/tabs/categories" },
            ].map((item) => (
              <TouchableOpacity
                key={item.path}
                onPress={() => handleNavigation(item.path)}
                style={styles.menuItem}
              >
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.menuBottom}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.menuText, { color: "red" }]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    // paddingVertical: 14,
    // paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    zIndex: 999,
  },
  menu: {
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 72,
    position: "absolute",
    right: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: -2, height: 0 },
  },
  menuClose: {
    position: "absolute",
    top: 48,
    right: 16,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  menuText: {
    fontSize: 18,
  },
  menuBottom: {
    marginTop: "auto",
    paddingTop: 16,
    paddingBottom: 48,
    paddingHorizontal: 4,
  },
  contentContainer: {
    flex: 1,
  },
});
