import { useMemo, useState } from "react";
import { View, StyleSheet, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { palette } from "../theme/colors";
import { deleteEntry, listEntries, upsertEntry, type JournalEntry } from "../lib/aiKick";
import { format } from "date-fns";

export function KickScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>(listEntries());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<JournalEntry | null>(null);

  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const handleSave = () => {
    if (!note.trim()) return;
    const entry = upsertEntry({
      id: editing?.id,
      date: today,
      title: title.trim() || "Quick reflection",
      note: note.trim(),
    });
    setEntries(listEntries());
    setTitle("");
    setNote("");
    setEditing(null);
    return entry;
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditing(entry);
    setTitle(entry.title);
    setNote(entry.note);
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setEntries(listEntries());
    if (editing?.id === id) {
      setEditing(null);
      setTitle("");
      setNote("");
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="title">AI Kick in the Pants</Text>
        <Text muted>Daily push to reflect, reset, and refocus.</Text>
      </View>

      <Card style={styles.form} padded>
        <Text variant="subtitle">{editing ? "Edit entry" : "Today's entry"}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={palette.muted}
          style={styles.input}
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What did you do? What will you do next?"
          placeholderTextColor={palette.muted}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
        <View style={styles.actions}>
          <Button onPress={handleSave} disabled={!note.trim()}>
            {editing ? "Update entry" : "Save entry"}
          </Button>
          <Button variant="outline" onPress={() => { setEditing(null); setTitle(""); setNote(""); }}>
            Clear
          </Button>
        </View>
      </Card>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <View style={{ marginVertical: 10 }}>
            <Text variant="subtitle">Timeline</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.entry}>
            <Text variant="caption" muted>
              {item.date}
            </Text>
            <Text variant="subtitle">{item.title}</Text>
            <Text>{item.note}</Text>
            <View style={styles.entryActions}>
              <Button variant="ghost" onPress={() => handleEdit(item)}>
                Edit
              </Button>
              <Button variant="ghost" onPress={() => handleDelete(item.id)}>
                Delete
              </Button>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <Text muted>No entries yet. Add today's reflection.</Text>
          </Card>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 12,
  },
  form: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  entry: {
    gap: 6,
  },
  entryActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
});

