"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useUser } from '../features/user/context/UserContext';
import { migrateLocalToFirestore } from '../lib/data/migration';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

interface UseSyncManagerReturn {
    syncStatus: SyncStatus;
    lastSyncTime: Date | null;
    isOnline: boolean;
    triggerSync: () => Promise<void>;
}

export function useSyncManager(): UseSyncManagerReturn {
    const { user: firebaseUser, firebaseAvailable } = useAuth();
    const { user, updateUser } = useUser();
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [isOnline, setIsOnline] = useState(
        typeof window !== 'undefined' ? navigator.onLine : true
    );

    // Monitor online/offline status
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleOnline = () => {
            console.log('🌐 Back online');
            setIsOnline(true);
            setSyncStatus('idle');
        };

        const handleOffline = () => {
            console.log('📴 Gone offline');
            setIsOnline(false);
            setSyncStatus('offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Trigger sync function
    const triggerSync = useCallback(async () => {
        if (!firebaseUser || !firebaseAvailable || !isOnline) {
            console.log('⏭️ Skipping sync: not logged in or offline');
            return;
        }

        if (user.settings.storageMode === 'cloud') {
            console.log('✅ Already in cloud mode');
            return;
        }

        try {
            setSyncStatus('syncing');
            console.log('🔄 Starting sync to cloud...');

            // Migrate local data to Firestore
            await migrateLocalToFirestore(firebaseUser.uid);

            // Switch to cloud mode
            updateUser({
                settings: {
                    ...user.settings,
                    storageMode: 'cloud',
                },
            });

            setSyncStatus('synced');
            setLastSyncTime(new Date());
            console.log('✅ Sync completed successfully');
        } catch (error) {
            console.error('❌ Sync failed:', error);
            setSyncStatus('error');
        }
    }, [firebaseUser, firebaseAvailable, isOnline, user, updateUser]);

    // Auto-sync on login
    useEffect(() => {
        if (
            firebaseUser &&
            firebaseAvailable &&
            isOnline &&
            user.settings.storageMode === 'local' &&
            syncStatus === 'idle'
        ) {
            console.log('🚀 Auto-syncing on login...');
            triggerSync();
        }
    }, [firebaseUser, firebaseAvailable, isOnline, user.settings.storageMode, syncStatus, triggerSync]);

    // Auto-sync when coming back online
    useEffect(() => {
        if (
            isOnline &&
            firebaseUser &&
            firebaseAvailable &&
            user.settings.storageMode === 'local' &&
            syncStatus === 'offline'
        ) {
            console.log('🔄 Auto-syncing after coming back online...');
            triggerSync();
        }
    }, [isOnline, firebaseUser, firebaseAvailable, user.settings.storageMode, syncStatus, triggerSync]);

    return {
        syncStatus,
        lastSyncTime,
        isOnline,
        triggerSync,
    };
}
