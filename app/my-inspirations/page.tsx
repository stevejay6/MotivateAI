"use client";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Edit2,
  Heart,
  Lightbulb,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import {
  CustomInspiration,
  createInspiration,
  deleteInspiration,
  listInspirations,
  updateInspiration,
} from "@/utils/customInspirationsApi";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type InspirationFormValues = Omit<CustomInspiration, "id">;

export default function MyInspirationsPage() {
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <MyInspirationsLayout />
    </QueryClientProvider>
  );
}

function MyInspirationsLayout() {
  const [showForm, setShowForm] = useState(false);
  const [editingInspiration, setEditingInspiration] =
    useState<CustomInspiration | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customInspirations"],
    queryFn: listInspirations,
  });

  const inspirations = data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: InspirationFormValues) => createInspiration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customInspirations"] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: InspirationFormValues;
    }) => updateInspiration(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customInspirations"] });
      setEditingInspiration(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInspiration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customInspirations"] });
    },
  });

  const handleSubmit = (values: InspirationFormValues) => {
    if (editingInspiration) {
      updateMutation.mutate({ id: editingInspiration.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteMutation.isPending) return;
    const confirmed = window.confirm(
      "Remove this inspiration from your collection?"
    );
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  const isFormLoading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const showEmptyState = useMemo(
    () => !isLoading && inspirations.length === 0,
    [isLoading, inspirations.length]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 py-12 px-4">
      <div className="pointer-events-none absolute -top-20 right-[-10rem] h-96 w-96 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-orange-300/40 blur-[120px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                <Zap className="h-4 w-4" />
                Personal Collection
              </span>
              <h1 className="text-4xl font-bold text-slate-900">
                My Inspirations
              </h1>
              <p className="max-w-xl text-sm text-slate-600">
                Create and save your own inspiring sparks. Capture a guiding
                thought, the emotion it evokes, and the small action you’ll take
                next.
              </p>
            </div>
            <Button
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-orange-600 hover:to-pink-600"
              onClick={() => {
                setEditingInspiration(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Inspiration
            </Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {showForm ? (
            <InspirationForm
              inspiration={editingInspiration}
              onSubmit={handleSubmit}
              onCancel={() => {
                setEditingInspiration(null);
                setShowForm(false);
              }}
              isLoading={isFormLoading}
            />
          ) : (
            <Card className="border-white/60 bg-white/90 shadow-xl backdrop-blur-lg">
              <CardContent className="flex h-full flex-col items-center justify-center space-y-3 py-12 text-center text-slate-500">
                <Lightbulb className="h-8 w-8 text-amber-400" />
                <p className="text-sm">
                  Click “Add New Inspiration” to capture your next idea.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="rounded-2xl border-slate-200 text-slate-700"
                >
                  Start now
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-white/60 bg-white/85 shadow-xl backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Saved Inspirations
              </CardTitle>
              <CardDescription>
                Your collection updates live as you add or edit entries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-slate-500">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                </div>
              ) : showEmptyState ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  No inspirations yet. Start by adding your first thought above.
                </div>
              ) : (
                <div className="space-y-4">
                  {inspirations.map((inspiration, index) => (
                    <InspirationItem
                      key={inspiration.id}
                      inspiration={inspiration}
                      index={index}
                      onEdit={(item) => {
                        setEditingInspiration(item);
                        setShowForm(true);
                      }}
                      onDelete={(id) => handleDelete(id)}
                      isDeleting={
                        deleteMutation.isPending &&
                        deleteMutation.variables === inspiration.id
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

type InspirationFormProps = {
  inspiration: CustomInspiration | null;
  onSubmit: (values: InspirationFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
};

function InspirationForm({
  inspiration,
  onSubmit,
  onCancel,
  isLoading,
}: InspirationFormProps) {
  const [formValues, setFormValues] = useState<InspirationFormValues>({
    think: inspiration?.think ?? "",
    author: inspiration?.author ?? "",
    feel: inspiration?.feel ?? "",
    do: inspiration?.do ?? "",
  });

  useEffect(() => {
    setFormValues({
      think: inspiration?.think ?? "",
      author: inspiration?.author ?? "",
      feel: inspiration?.feel ?? "",
      do: inspiration?.do ?? "",
    });
  }, [inspiration]);

  const handleChange = (
    field: keyof InspirationFormValues,
    value: string
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.think.trim() || !formValues.do.trim()) return;
    onSubmit({
      think: formValues.think.trim(),
      author: formValues.author?.trim(),
      feel: formValues.feel?.trim(),
      do: formValues.do.trim(),
    });
  };

  const submitLabel = inspiration ? "Update inspiration" : "Save inspiration";
  const isDisabled =
    isLoading || !formValues.think.trim() || !formValues.do.trim();

  return (
    <Card className="border-white/60 bg-white/90 shadow-2xl rounded-2xl backdrop-blur-xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
            <Heart className="h-5 w-5 text-rose-500" />
            {inspiration ? "Edit Inspiration" : "Capture Inspiration"}
          </CardTitle>
          <CardDescription>
            Fill in the sections below to shape your next inspiring idea.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="inspiration-think"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-600">
                <Lightbulb className="h-3.5 w-3.5" />
                Think
              </span>
            </Label>
            <Textarea
              id="inspiration-think"
              rows={3}
              placeholder="What idea sparked you?"
              value={formValues.think}
              onChange={(event) => handleChange("think", event.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inspiration-author">Author / Source</Label>
            <Input
              id="inspiration-author"
              placeholder="Optional — where did this come from?"
              value={formValues.author}
              onChange={(event) => handleChange("author", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="inspiration-feel"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-500">
                <Heart className="h-3.5 w-3.5" />
                Feel
              </span>
            </Label>
            <Textarea
              id="inspiration-feel"
              rows={3}
              placeholder="Describe the emotion or energy it gives you."
              value={formValues.feel}
              onChange={(event) => handleChange("feel", event.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="inspiration-do"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                <Zap className="h-3.5 w-3.5" />
                Do
              </span>
            </Label>
            <Textarea
              id="inspiration-do"
              rows={3}
              placeholder="A small action or experiment you’ll try next."
              value={formValues.do}
              onChange={(event) => handleChange("do", event.target.value)}
              className="resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isLoading ? "Saving..." : submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}

type InspirationItemProps = {
  inspiration: CustomInspiration;
  index: number;
  onEdit: (inspiration: CustomInspiration) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

function InspirationItem({
  inspiration,
  index,
  onEdit,
  onDelete,
  isDeleting,
}: InspirationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border border-orange-100 bg-white/95 shadow-lg backdrop-blur">
        <CardContent className="space-y-5 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {inspiration.think}
              </p>
              {inspiration.author && (
                <p className="text-xs uppercase tracking-wide text-slate-400 mt-1">
                  {inspiration.author}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-1 rounded-full border-slate-200 text-slate-600"
                onClick={() => onEdit(inspiration)}
                disabled={isDeleting}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="inline-flex items-center gap-1 rounded-full"
                onClick={() => onDelete(inspiration.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Removing..." : "Delete"}
              </Button>
            </div>
          </div>

          {inspiration.feel && (
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-r from-orange-500/15 to-amber-400/20 p-4 text-sm text-gray-700">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                <Heart className="h-4 w-4" />
                Feel
              </div>
              <p className="text-gray-800">{inspiration.feel}</p>
            </div>
          )}

          {inspiration.do && (
            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-400/25 to-orange-400/30 p-4 text-sm text-gray-800">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-600">
                <Zap className="h-4 w-4" />
                Do
              </div>
              <p>{inspiration.do}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}


