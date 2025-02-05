DO $$
BEGIN
    RAISE NOTICE 'Creating schema whatsappclone...';
    CREATE SCHEMA IF NOT EXISTS whatsappclone;
    RAISE NOTICE 'Schema whatsappclone created successfully.';
END $$;