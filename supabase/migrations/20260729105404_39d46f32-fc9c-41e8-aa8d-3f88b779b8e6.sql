
CREATE POLICY "Public can read media-recognition objects"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media-recognition');
