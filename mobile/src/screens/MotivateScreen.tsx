import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { palette } from "../theme/colors";
import { craftMotivateReply } from "../lib/motivate";

type Message = { id: string; role: "user" | "coach"; content: string };

export function MotivateScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "preset",
      role: "coach",
      content: "Tell me what you're delaying. I'll give you a 5-minute challenge.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const user: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    const coach: Message = { id: `c-${Date.now()}`, role: "coach", content: craftMotivateReply(trimmed) };
    setMessages((prev) => [...prev, user, coach]);
    setInput("");
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="title">Motivate Me Now</Text>
        <Text muted>Bold, direct nudges to move now.</Text>
      </View>
      <View style={styles.messages}>
        {messages.map((message) => (
          <Card
            key={message.id}
            style={[
              styles.bubble,
              message.role === "user" ? styles.userBubble : styles.coachBubble,
            ]}
          >
            <Text variant="caption" muted>
              {message.role === "user" ? "You" : "Coach"}
            </Text>
            <Text>{message.content}</Text>
          </Card>
        ))}
      </View>
      <Card style={styles.inputCard}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="What's the blocker?"
          placeholderTextColor={palette.muted}
          style={styles.input}
          multiline
          numberOfLines={3}
        />
        <Button onPress={send} disabled={!input.trim()}>
          Send
        </Button>
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
  coachBubble: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FFEDD5",
  },
  inputCard: {
    gap: 10,
  },
  input: {
    minHeight: 70,
    textAlignVertical: "top",
    fontSize: 15,
    color: palette.text,
  },
});

