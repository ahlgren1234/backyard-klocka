-- Drop existing check constraint if it exists
ALTER TABLE races DROP CONSTRAINT IF EXISTS lap_reduction_check;

-- Add new check constraint that allows 0 for backyard races
ALTER TABLE races ADD CONSTRAINT lap_reduction_check 
  CHECK (
    (type = 'backyard' AND lap_reduction = 0) OR 
    (type = 'frontyard' AND lap_reduction > 0)
  ); 