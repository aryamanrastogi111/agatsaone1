-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    SELECT COALESCE(MAX(
        CASE 
            WHEN invoice_number LIKE 'AGT-' || year_part || '-%' 
            THEN CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO sequence_num
    FROM public.recharge_requests;
    
    NEW.invoice_number := 'AGT-' || year_part || '-' || LPAD(sequence_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;