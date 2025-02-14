import React, { useState } from 'react';
import { useContactStore } from '../lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowLeft, Trash2, Download, Pencil, Save } from 'lucide-react';
import { FieldEditor } from './FieldEditor';
import { motion } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { EditIdentity } from './EditIdentity';
import { create, BaseDirectory, writeTextFile, writeFile } from '@tauri-apps/plugin-fs';
import { saveAs } from 'file-saver';
import { save } from "@tauri-apps/plugin-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const ContactDetail: React.FC = () => {
    const { contacts, selectedContactId, fieldSearchQuery, setFieldSearchQuery, addField, setSelectedContact, deleteContact, setWho } = useContactStore();
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'markdown'>('pdf');
    const [who, setWhoState] = React.useState('');
    const [isEditingIdentity, setIsEditingIdentity] = useState(false);
    const selectedContact = contacts.find(c => c.id === selectedContactId);

    if (!selectedContact) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-400">
                Select a contact to view details
            </div>
        );
    }

    const filteredFields = selectedContact.fields
        .filter(field =>
            field.label.toLowerCase().includes(fieldSearchQuery.toLowerCase()) ||
            field.value.toLowerCase().includes(fieldSearchQuery.toLowerCase())
        )
        .sort((a, b) => {
            return sortDirection === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
        });

    const handleExport = async () => {
        if (exportFormat === 'markdown') {
            const markdownContent = `# ${selectedContact.name}\n\n` +
                selectedContact.fields.map(field => `**${field.label}:** ${field.value}\n`).join('\n');
            try {
                const filePath = await save({
                    filters: [{
                        name: 'Markdown',
                        extensions: ['md']
                    }]
                });
                if (filePath) {
                    await writeTextFile(filePath, markdownContent);
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: "Failed to save markdown file.",
                });
            }
        } else {
            try {
                const doc = new jsPDF();
                doc.setFontSize(16);
                doc.text(selectedContact.name, 20, 20);
                doc.setFontSize(12);

                let yPosition = 40;
                selectedContact.fields.forEach(field => {
                    doc.text(`${field.label}: ${field.value}`, 20, yPosition);
                    yPosition += 10;
                });

                const filePath = await save({
                    filters: [{
                        name: 'PDF',
                        extensions: ['pdf']
                    }]
                });

                if (filePath) {
                    const pdfBytes = doc.output('arraybuffer');
                    await writeFile(filePath, new Uint8Array(pdfBytes));
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: "Failed to save PDF file.",
                });
            }
        }
        setShowExportDialog(false);
        toast({
            variant: "dark",
            description: "Download has been initiated.",
        });
    };

    return (
        <motion.div
            className="fixed inset-0 bg-zinc-950 z-50 flex flex-col h-full max-h-screen overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {selectedContactId && (
                <EditIdentity open={isEditingIdentity} onClose={() => setIsEditingIdentity(false)} selectedContactId={selectedContactId} />
            )}

            <Card className="flex-1 border-0 rounded-none bg-zinc-950 flex flex-col h-full overflow-hidden">
                <CardHeader className="flex flex-row sticky top-0 bg-zinc-950/80 backdrop-blur-sm z-10 items-center justify-between border-b border-zinc-900 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedContact(null)}
                            className="rounded-full hover:bg-zinc-900 text-zinc-400"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex flex-col items-start">
                            <span className="text-zinc-200 font-medium">{selectedContact.name}</span>
                            <span className="text-sm text-zinc-500">{selectedContact.who}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="notStupidGhost"
                            className="h-8 w-8 rounded-full hover:bg-zinc-900 text-zinc-400"
                            onClick={() => setIsEditingIdentity(true)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full hover:bg-zinc-900 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-zinc-200">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-zinc-400">
                                        This action cannot be undone. This will permanently delete this contact and remove any data locally.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
                                        Nevermind
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => selectedContactId && deleteContact(selectedContactId)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete it! 🗑️
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 flex flex-col h-full overflow-hidden">
                    <div className="relative flex mb-4 items-center gap-2 flex-shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search fields..."
                                value={fieldSearchQuery}
                                onChange={(e) => setFieldSearchQuery(e.target.value)}
                                className="pl-9 bg-zinc-900 border-none text-zinc-300 placeholder:text-zinc-500 rounded-xl"
                            />
                        </div>
                        <Button
                            variant="notStupidGhost"
                            className="rounded-xl bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            onClick={() => addField(selectedContact.id, { label: 'New Field', value: '' })}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 h-full overflow-y-auto -mx-4 px-4">
                        <div className="space-y-2">
                            {filteredFields.map((field) => (
                                <FieldEditor
                                    key={field.id}
                                    contactId={selectedContact.id}
                                    field={field}
                                    selectedFieldId={selectedFieldId}
                                    setSelectedFieldId={(id: string | null) => setSelectedFieldId(id)}
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </CardContent>
            </Card>

            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogContent className="bg-zinc-950 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-zinc-200">Select Export Format</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Please choose the file type you want to export the contact as:
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col justify-between gap-2'>
                        <div className="px-4 flex items-center gap-2 w-full">
                            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'pdf' | 'markdown')}>
                                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                                    <SelectValue placeholder="Select a filetype" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    <SelectGroup>
                                        <SelectLabel className="text-zinc-400">File Types</SelectLabel>
                                        <SelectItem value="pdf" className="text-zinc-300">PDF</SelectItem>
                                        <SelectItem value="markdown" className="text-zinc-300">Markdown</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-row justify-end gap-3 pt-6">
                            <DialogClose asChild>
                                <Button
                                    variant="notStupidGhost"
                                    className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl px-4 h-11"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={handleExport}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl px-4 h-11"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};