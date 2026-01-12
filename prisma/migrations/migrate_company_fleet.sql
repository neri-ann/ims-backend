-- Check and migrate any COMPANY_FLEET values to DEALERSHIP before removing the enum value
UPDATE bus 
SET source = 'DEALERSHIP' 
WHERE source = 'COMPANY_FLEET';
