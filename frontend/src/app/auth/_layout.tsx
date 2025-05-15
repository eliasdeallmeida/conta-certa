import { ScrollView, StyleSheet, StatusBar } from "react-native";
import { Slot } from "expo-router";
import Logo from "../../components/Logo";

export default function Layout() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Logo />
      <Slot />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
});
