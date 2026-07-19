CREATE OR REPLACE FUNCTION increment_copy_count(comp_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE components
  SET copy_count = copy_count + 1
  WHERE id = comp_id;
END;
$$;
