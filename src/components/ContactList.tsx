'use client'
import React from 'react';
import { useContactStore } from '../lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const ContactList: React.FC = () => {
    const { contacts, selectedContactId, searchQuery, setSelectedContact, setSearchQuery, deleteContact } = useContactStore();
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-zinc-950">
            <div className="p-4">
                <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-zinc-900 border-none text-zinc-300 placeholder:text-zinc-500 rounded-xl"
                        />
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                        <Star className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                        ⋯
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
                <AnimatePresence>
                    {filteredContacts.map((contact) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 100 }}
                            onDragEnd={(event, info) => {
                                if (info.offset.x > 100) {
                                    deleteContact(contact.id);
                                }
                            }}
                        >
                            <Button
                                variant="ghost"
                                className={`w-full justify-between px-4 py-3 h-16 mb-1 rounded-xl hover:bg-zinc-900 ${
                                    selectedContactId === contact.id ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-zinc-300'
                                }`}
                                onClick={() => setSelectedContact(contact.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.id}`} />
                                        <AvatarFallback>
                                            <User className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{contact.name}</span>
                                        <span className="text-sm text-zinc-500">Software Engineer</span>
                                    </div>
                                </div>
                                <Star className={`h-4 w-4 ${
                                    selectedContactId === contact.id ? 'text-white' : 'text-zinc-500'
                                }`} />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContactList;