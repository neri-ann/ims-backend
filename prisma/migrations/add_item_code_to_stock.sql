-- Step 1: Add item_code column as nullable first
ALTER TABLE stock ADD COLUMN IF NOT EXISTS item_code VARCHAR(255);

-- Step 2: Populate item_code from item table using item_id
UPDATE stock s
SET item_code = i.item_code
FROM item i
WHERE s.item_id = i.id;

-- Step 3: Make item_code NOT NULL after data is populated
ALTER TABLE stock ALTER COLUMN item_code SET NOT NULL;

-- Step 4: Add unique constraint
ALTER TABLE stock ADD CONSTRAINT stock_item_code_key UNIQUE (item_code);

-- Step 5: Add foreign key constraint
ALTER TABLE stock ADD CONSTRAINT stock_item_code_fkey 
  FOREIGN KEY (item_code) REFERENCES item(item_code) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 6: Create index
CREATE INDEX IF NOT EXISTS stock_item_code_idx ON stock(item_code);

-- Step 7: Drop old item_id column if it exists
ALTER TABLE stock DROP COLUMN IF EXISTS item_id;
