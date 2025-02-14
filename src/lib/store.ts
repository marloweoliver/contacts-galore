import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContactField {
    id: string;
    label: string;
    value: string;
    createdAt: number;
    isEditing?: boolean;
}

export interface Contact {
    id: string;
    name: string;
    fields: ContactField[];
}

interface ContactStore {
    contacts: Contact[];
    selectedContactId: string | null;
    searchQuery: string;
    fieldSearchQuery: string;
    addContact: (contact: Omit<Contact, 'id'>) => void;
    updateContact: (id: string, contact: Partial<Contact>) => void;
    deleteContact: (id: string) => void;
    addField: (contactId: string, field: Omit<ContactField, 'id' | 'createdAt'>) => void;
    updateField: (contactId: string, fieldId: string, field: Partial<ContactField>) => void;
    deleteField: (contactId: string, fieldId: string) => void;
    setSelectedContact: (id: string | null) => void;
    setSearchQuery: (query: string) => void;
    setFieldSearchQuery: (query: string) => void;
    toggleFieldEdit: (contactId: string, fieldId: string) => void;
}

export const useContactStore = create<ContactStore>()(
    persist(
        (set) => ({
            contacts: [],
            selectedContactId: null,
            searchQuery: '',
            fieldSearchQuery: '',
            setSelectedContact: (id) => set({ selectedContactId: id }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            setFieldSearchQuery: (query) => set({ fieldSearchQuery: query }),
            addContact: (contact) =>
                set((state) => ({
                    contacts: [...state.contacts, { ...contact, id: crypto.randomUUID() }],
                })),
            updateContact: (id, contact) =>
                set((state) => ({
                    contacts: state.contacts.map((c) =>
                        c.id === id ? { ...c, ...contact } : c
                    ),
                })),
            deleteContact: (id) =>
                set((state) => ({
                    contacts: state.contacts.filter((c) => c.id !== id),
                    selectedContactId: state.selectedContactId === id ? null : state.selectedContactId,
                })),
            addField: (contactId, field) =>
                set((state) => ({
                    contacts: state.contacts.map((c) =>
                        c.id === contactId
                            ? {
                                ...c,
                                fields: [
                                    ...c.fields,
                                    {
                                        ...field,
                                        id: crypto.randomUUID(),
                                        createdAt: Date.now(),
                                        isEditing: true,
                                    },
                                ],
                            }
                            : c
                    ),
                })),
            updateField: (contactId, fieldId, field) =>
                set((state) => ({
                    contacts: state.contacts.map((c) =>
                        c.id === contactId
                            ? {
                                ...c,
                                fields: c.fields.map((f) =>
                                    f.id === fieldId ? { ...f, ...field } : f
                                ),
                            }
                            : c
                    ),
                })),
            deleteField: (contactId, fieldId) =>
                set((state) => ({
                    contacts: state.contacts.map((c) =>
                        c.id === contactId
                            ? {
                                ...c,
                                fields: c.fields.filter((f) => f.id !== fieldId),
                            }
                            : c
                    ),
                })),
            toggleFieldEdit: (contactId, fieldId) =>
                set((state) => ({
                    contacts: state.contacts.map((c) =>
                        c.id === contactId
                            ? {
                                ...c,
                                fields: c.fields
                                    .map((f) =>
                                        f.id === fieldId ? { ...f, isEditing: !f.isEditing } : f
                                    )
                                    .filter((f) => f.value?.trim() !== "" && f.label?.toLowerCase() !== "new field"), // Remove empty or "new field"
                            }
                            : c
                    ),
                })),

        }),
        {
            name: 'contacts-storage',
        }
    )
);