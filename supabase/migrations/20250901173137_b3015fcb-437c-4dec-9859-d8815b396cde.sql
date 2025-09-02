-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('hospital', 'doctor');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  hospital_name TEXT, -- Only for hospitals
  doctor_license TEXT, -- Only for doctors
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create patient records table
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  surgery_details TEXT,
  medicines TEXT,
  diagnosis TEXT,
  notes TEXT,
  hospital_id UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for patient records
CREATE POLICY "Hospitals can view their own patient records" 
ON public.patient_records 
FOR SELECT 
USING (hospital_id = auth.uid());

CREATE POLICY "Hospitals can create patient records" 
ON public.patient_records 
FOR INSERT 
WITH CHECK (hospital_id = auth.uid());

CREATE POLICY "Hospitals can update their own patient records" 
ON public.patient_records 
FOR UPDATE 
USING (hospital_id = auth.uid());

CREATE POLICY "Doctors can view all patient records" 
ON public.patient_records 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'doctor'
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
BEFORE UPDATE ON public.patient_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name, hospital_name, doctor_license)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data ->> 'role')::user_role,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'hospital_name',
    NEW.raw_user_meta_data ->> 'doctor_license'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();