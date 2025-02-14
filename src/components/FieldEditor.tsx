'use client'

import React, { useState } from 'react';
import { ContactField, useContactStore } from '../lib/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ArrowLeft, Trash2, Download, Pencil, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface FieldEditorProps {
    contactId: string;
    field: ContactField;
    selectedFieldId: string | null;
    setSelectedFieldId: (id: string | null) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ contactId, field, selectedFieldId, setSelectedFieldId }) => {
    const { updateField, deleteField, toggleFieldEdit } = useContactStore();
    const [tempLabel, setTempLabel] = useState(field.label);
    const [tempValue, setTempValue] = useState(field.value);
    const isSelected = selectedFieldId === field.id;

    const handleToggleSelect = () => {
        setSelectedFieldId(isSelected ? null : field.id);
    };

    const handleSave = () => {
        if (tempLabel != 'New Field' && tempValue != '') {
            updateField(contactId, field.id, {
                label: tempLabel,
                value: tempValue,
                isEditing: false,
            });
        }
    };

    if (!field.isEditing) {
        return (
            <motion.div
                layout
                className={`group rounded-2xl p-4 space-y-2 transition-all duration-200 ${
                    isSelected 
                    ? "bg-gradient-to-br from-zinc-900/90 to-zinc-900 shadow-lg" 
                    : "hover:bg-zinc-900/50 hover:shadow-md"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={handleToggleSelect}
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium text-zinc-400/90">
                            {field.label}
                        </div>
                        <div className="text-lg font-semibold text-zinc-100 break-words">
                            {field.value}
                        </div>
                    </div>
                    <div className={`flex gap-2 transition-all duration-200 ${
                        isSelected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}>
                        <Button
                            variant="notStupidGhost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                isSelected ? toggleFieldEdit(contactId, field.id) : handleToggleSelect();
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-zinc-800/50 hover:bg-red-900/30 text-zinc-400 hover:text-red-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                isSelected ? deleteField(contactId, field.id) : handleToggleSelect();
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-2xl p-5 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-zinc-400/90 mb-1.5 block">
                        Field Name
                    </label>
                    <Input
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-zinc-400/90 mb-1.5 block">
                        Value
                    </label>
                    <Input
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-5">
                <Button
                    variant="ghost"
                    onClick={() => toggleFieldEdit(contactId, field.id)}
                    className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl px-4 h-11"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl px-4 h-11 transition-all duration-200"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
            </div>
        </motion.div>
    );
};