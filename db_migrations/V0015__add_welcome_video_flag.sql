-- Add is_welcome_video column to course_files table
ALTER TABLE course_files 
ADD COLUMN IF NOT EXISTS is_welcome_video BOOLEAN DEFAULT FALSE;

-- Add comment for clarity
COMMENT ON COLUMN course_files.is_welcome_video 
IS 'Флаг для отметки видео-приветствия, которое показывается отдельным блоком в личном кабинете';