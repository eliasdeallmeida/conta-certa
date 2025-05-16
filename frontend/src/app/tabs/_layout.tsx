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
  // const pageTitle = pages[pathname] || "App";
  const [menuVisible, setMenuVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  function getPageTitle(pathname: string) {
    if (pages[pathname]) return pages[pathname];

    // Procurar manualmente por rota dinâmica correspondente
    if (/^\/tabs\/transactions\/\d+$/.test(pathname)) {
      return pages["/tabs/transactions/[id]"];
    }

    if (/^\/tabs\/categories\/\d+$/.test(pathname)) {
      return pages["/tabs/categories/[id]"];
    }

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
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {menuVisible && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          >
            <TouchableOpacity onPress={closeMenu} style={styles.menuClose}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>

            {[
              // { label: "Perfil", path: "/tabs/profile" },
              { label: "Início", path: "/tabs/home" },
              { label: "Transações", path: "/tabs/transactions" },
              { label: "Categorias", path: "/tabs/categories" },
              { label: "Metas", path: "/tabs/goals" },
              { label: "Limites", path: "/tabs/limits" },
              { label: "Lembretes", path: "/tabs/reminders" },
              { label: "Lista de desejos", path: "/tabs/wishlist" },
              { label: "Relatórios", path: "/tabs/reports" },
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

      {/* <View style={{ flex: 1 }}>{children}</View> */}
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
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
    padding: 20,
    paddingTop: 50,
    position: "absolute",
    right: 0,
  },
  menuClose: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 18,
  },
  menuBottom: {
    marginTop: "auto",
    paddingTop: 20,
  },
});
