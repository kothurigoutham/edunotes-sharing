
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view notes" ON public.notes;
DROP POLICY IF EXISTS "CRs can insert notes" ON public.notes;
DROP POLICY IF EXISTS "CRs can update notes" ON public.notes;
DROP POLICY IF EXISTS "CRs can delete notes" ON public.notes;

CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "CRs can insert notes" ON public.notes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'cr'));
CREATE POLICY "CRs can update notes" ON public.notes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'cr'));
CREATE POLICY "CRs can delete notes" ON public.notes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'cr'));

-- Fix profiles policies too
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only CRs can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only CRs can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'cr'));
