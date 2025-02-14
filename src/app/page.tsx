'use client';

import { useState } from 'react';
import { ContactList } from '../components/ContactList';
import { ContactDetail } from '../components/ContactDetail';
import { ContactForm } from '../components/ContactForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Home() {
    const [isAddingContact, setIsAddingContact] = useState(false);

    return (
        <div className="h-screen flex flex-col sm:flex-row">
            <div className="w-full h-screen sm:w-64 border-r flex flex-col relative">
                <div className="p-4 border-b absolute bottom-0">
                    <Button
                        onClick={() => setIsAddingContact(true)}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                    </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ContactList />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <ContactDetail />
            </div>
            <ContactForm
                open={isAddingContact}
                onClose={() => setIsAddingContact(false)}
            />
        </div>
    );
}