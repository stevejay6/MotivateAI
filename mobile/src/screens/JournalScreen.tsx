import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { palette } from "../theme/colors";
import { craftJournalReply } from "../lib/aiJournal";

type Message = { id: string; role: "user" | "guide"; content: string };

export function JournalScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [count, setCount] = useState(0);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const user: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    const historyText = [...messages, user]
      .map((m) => `${m.role === "user" ? "User" : "Guide"}: ${m.content}`)
      .join("\n");
    const guide: Message = {
      id: `g-${Date.now()}`,
      role: "guide",
      content: craftJournalReply(historyText, trimmed),
    };
    setMessages((prev) => [...prev, user, guide]);
    setInput("");
    setCount((prev) => prev + 1);
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    setCount(0);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="title">AI Journal</Text>
        <Text muted>{count} / 8 reflections</Text>
      </View>
      <View style={styles.messages}>
        {messages.map((message) => (
          <Card
            key={message.id}
            style={[
              styles.bubble,
              message.role === "user" ? styles.userBubble : styles.guideBubble,
            ]}
          >
            <Text variant="caption" muted>
              {message.role === "user" ? "You" : "Guide"}
            </Text>
            <Text>{message.content}</Text>
          </Card>
        ))}
      </View>
      <Card style={styles.inputCard}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Capture what's alive for you..."
          placeholderTextColor={palette.muted}
          style={styles.input}
          multiline
          numberOfLines={4}
        />
        <View style={styles.actions}>
          <Button onPress={send} disabled={!input.trim()}>
            Send reflection
          </Button>
          <Button variant="outline" onPress={reset}>
            Reset
          </Button>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 12,
  },
  messages: {
    gap: 10,
    flex: 1,
    marginBottom: 12,
  },
  bubble: {
    gap: 4,
  },
  userBubble: {
    backgroundColor: "#EEF2FF",
    borderColor: "#E0E7FF",
  },
  guideBubble: {
    backgroundColor: "#FDF2F8",
    borderColor: "#FCE7F3",
  },
  inputCard: {
    gap: 10,
  },
  input: {
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 15,
    color: palette.text,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
});

