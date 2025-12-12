import { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { palette } from "../theme/colors";
import { craftCoachReply } from "../lib/emotionalCoach";

type Message = { id: string; role: "user" | "coach"; content: string };

export function EmotionalCoachScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "coach",
      content: "I'm here to listen without judgment. What would you like to share?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<View | null>(null);

  useEffect(() => {
    scrollRef.current?.measure?.(() => {});
  }, [messages]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMessage: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    const historyText = [...messages, userMessage]
      .map((m) => `${m.role === "user" ? "Me" : "Coach"}: ${m.content}`)
      .join("\n");
    const reply = craftCoachReply(historyText);
    const aiMessage: Message = { id: `c-${Date.now()}`, role: "coach", content: reply };
    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text variant="title">Emotional Coach</Text>
          <Text muted>Supportive reflections with gentle follow-ups.</Text>
        </View>
        <View style={styles.messages}>
          {messages.map((message) => (
            <Card
              key={message.id}
              style={[
                styles.bubble,
                message.role === "user" ? styles.userBubble : styles.coachBubble,
              ]}
              padded
            >
              <Text variant="caption" muted>
                {message.role === "user" ? "You" : "Coach"}
              </Text>
              <Text>{message.content}</Text>
            </Card>
          ))}
          <View ref={scrollRef} />
        </View>
        <Card style={styles.inputCard}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Share what's on your mind..."
            placeholderTextColor={palette.muted}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <Button onPress={send}>Send</Button>
        </Card>
      </KeyboardAvoidingView>
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
    backgroundColor: "#ECFEFF",
    borderColor: "#CFFAFE",
  },
  inputCard: {
    gap: 10,
  },
  input: {
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 15,
    color: palette.text,
  },
});

