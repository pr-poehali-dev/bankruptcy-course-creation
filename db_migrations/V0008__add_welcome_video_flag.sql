-- Add is_welcome_video column to course_files table
ALTER TABLE t_p19166386_bankruptcy_course_cr.course_files 
ADD COLUMN is_welcome_video BOOLEAN DEFAULT FALSE;

-- Add comment for clarity
COMMENT ON COLUMN t_p19166386_bankruptcy_course_cr.course_files.is_welcome_video 
IS 'Флаг для отметки видео-приветствия, которое показывается отдельным блоком в личном кабинете';