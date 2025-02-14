'use client'
import React, { useState } from 'react';
import { useContactStore } from '../lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

export const ContactList: React.FC = () => {
    const {
        contacts,
        selectedContactId,
        searchQuery,
        showFavoritesOnly,
        setSelectedContact,
        setSearchQuery,
        deleteContact,
        toggleFavorite,
        setShowFavoritesOnly
    } = useContactStore();

    const filteredContacts = contacts
        .filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!showFavoritesOnly || contact.isFavorite)
        );
    const throwPopUp = () => {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }
    const [delPopUp, setDelPopUp] = useState(false)

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
                        variant="notStupidGhost"
                        className={`rounded-full bg-zinc-900 ${showFavoritesOnly
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-zinc-400 '
                            } hover:bg-zinc-800`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                        <Star className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="notStupidGhost"
                        className="rounded-full bg-zinc-900 text-zinc-400  hover:bg-zinc-800"
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
                        >
                            <Button
                                variant="notStupidGhost"
                                className={`w-full justify-between px-4 py-3 h-16 mb-1 rounded-xl ${selectedContactId === contact.id
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'text-zinc-300'
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
                                        {/* Ensure the text color remains consistent */}
                                        <span className={'font-medium text-white'}>
                                            {contact.name}
                                        </span>
                                        <span className="text-sm text-zinc-500">test Engineer</span>
                                    </div>
                                </div>
                                <Button
                                    variant="notStupidGhost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(contact.id);
                                    }}
                                    className="active:scale-95"
                                >
                                    <Star className={`h-8 w-8 ${contact.isFavorite
                                        ? 'text-yellow-400'
                                        : 'text-zinc-500'
                                        }`} />
                                </Button>
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContactList;