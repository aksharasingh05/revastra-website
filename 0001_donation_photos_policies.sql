CREATE POLICY "Donors upload own donation photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'donation-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Donors and admins view donation photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'donation-photos' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Admins delete donation photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'donation-photos' AND public.has_role(auth.uid(), 'admin'));