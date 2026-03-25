"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
    showPrices: boolean;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
    showPrices: true,
    loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [showPrices, setShowPrices] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    setShowPrices(data.showPrices);
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ showPrices, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
